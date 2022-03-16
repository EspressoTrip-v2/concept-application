import "./tracer";
import { LogCodes, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { grpcServer } from "./services";
import mongoose from "mongoose";
import { CreateUserConsumer, DeleteUserConsumer, UpdateUserConsumer } from "./events";
import { LocalLogger } from "./utils";

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.MONGO_DBNAME) throw new Error("MONGO_DBNAME must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[auth-service:rabbitmq]: Connected successfully`);
        /** Start Logger */
        LocalLogger.start(rabbitClient.connection, MicroServiceNames.AUTH_SERVICE);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!, { dbName: process.env.MONGO_DBNAME! });
        console.log(`[auth-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        const gRPC = grpcServer(rabbitClient.connection).listen(`[auth-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);

        /** Create RabbitMQ consumers */
        await new UpdateUserConsumer(rabbitClient.connection).listen();
        await new CreateUserConsumer(rabbitClient.connection).listen();
        await new DeleteUserConsumer(rabbitClient.connection).listen();
    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-service:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "auth/auth-service/srv/index.ts:35", msg.stack! || "No stack trace");
    }
}

main();
