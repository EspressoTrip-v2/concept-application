import "./tracer";
import { GrpcServer, grpcServer } from "./services";
import mongoose from "mongoose";
import { LogCodes, MicroServiceNames, RabbitClient, rabbitClient } from "@espressotrip-org/concept-common";
import { CreateUserPublisher, DeleteUserPublisher, UpdateEmployeeConsumer, UpdateEmployeeTaskPublisher, UpdateUserPublisher, UserSaveFailureConsumer } from "./events";
import { LocalLogger } from "./utils";

async function main(): Promise<void> {
    let rabbit: RabbitClient | undefined;
    let gRPC: GrpcServer | undefined;
    try {
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.MONGO_DBNAME) throw new Error("MONGO_DBNAME must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        rabbit = await rabbitClient.connect(process.env.RABBIT_URI!, `[employee-service:rabbitmq]: Connected successfully`);
        /** Start logger */
        const logChannel = await rabbit.addChannel("log");
        LocalLogger.start(logChannel, MicroServiceNames.EMPLOYEE_SERVICE);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!, { dbName: process.env.MONGO_DBNAME! });
        console.log(`[employee-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        gRPC = grpcServer(rabbitClient.connection).listen(`[employee-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);

        /** Create Publishers */
        const cupChannel = await rabbit.addChannel("cup");
        CreateUserPublisher.NewCreateUserPublisher(cupChannel);
        const dupChannel = await rabbit.addChannel("dup");
        DeleteUserPublisher.NewDeleteUserPublisher(dupChannel);
        const uupChannel = await rabbit.addChannel("uup");
        UpdateUserPublisher.NewUpdateUserPublisher(uupChannel);
        const uetpChannel = await rabbit.addChannel("uet");
        UpdateEmployeeTaskPublisher.NewUpdateEmployeeTaskPublisher(uetpChannel);

        /** Rabbit Consumers */
        const usfcChannel = await rabbit.addChannel("usfc");
        await new UserSaveFailureConsumer(usfcChannel).listen();
        const uecChannel = await rabbit.addChannel("uec");
        await new UpdateEmployeeConsumer(uecChannel).listen();
    } catch (error) {
        const msg = error as Error;
        console.log(`[employee-service:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "employee/employee-service/src/index.ts:48", msg.stack! || "No stack trace");
        if (rabbit) await rabbit.connection.close();
        if (gRPC) gRPC.m_server.forceShutdown()
    }
}

main();
