import "./tracer";
import { LogCodes, MicroServiceNames, RabbitClient, rabbitClient } from "@espressotrip-org/concept-common";
import { GrpcServer, grpcServer } from "./services";
import mongoose from "mongoose";
import { CreateUserConsumer, DeleteUserConsumer, UpdateEmployeePublisher, UpdateUserConsumer, UserSaveFailurePublisher } from "./events";
import { LocalLogger } from "./utils";

async function main(): Promise<void> {
    let rabbit: RabbitClient | undefined
    let gRPC: GrpcServer | undefined
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.MONGO_DBNAME) throw new Error("MONGO_DBNAME must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        rabbit = await rabbitClient.connect(process.env.RABBIT_URI!, `[auth-service:rabbitmq]: Connected successfully`);
        /** Start Logger */
        const logChannel = await rabbit.addChannel("log");
        LocalLogger.start(logChannel, MicroServiceNames.AUTH_SERVICE);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!, { dbName: process.env.MONGO_DBNAME! });
        console.log(`[auth-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        gRPC = grpcServer(rabbitClient.connection).listen(`[auth-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);

        /** Create Publishers */
        const uepChannel = await rabbit.addChannel("uep")
        UpdateEmployeePublisher.NewUpdateEmployeePublisher(uepChannel);
        const usfpChannel = await rabbit.addChannel("usfp")
        UserSaveFailurePublisher.NewUserSaveFailurePublisher(usfpChannel);

        /** Create RabbitMQ consumers */
        const uucChannel = await rabbit.addChannel("uuc");
        await new UpdateUserConsumer(uucChannel).listen();
        const cucChannel = await rabbit.addChannel("cuc");
        await new CreateUserConsumer(cucChannel).listen();
        const ducChannel = await rabbit.addChannel("duc");
        await new DeleteUserConsumer(ducChannel).listen();

    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-service:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "auth/auth-service/srv/index.ts:48", msg.stack! || "No stack trace");
        if (rabbit) await rabbit.connection.close()
        if (gRPC) gRPC.m_server.forceShutdown()
    }
}

main();
