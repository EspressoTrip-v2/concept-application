import { grpcServer } from "./services";
import mongoose from "mongoose";
import { CreateEmployeeSigninConsumer, UpdateEmployeeSigninConsumer } from "./events";
import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.MONGO_DBNAME) throw new Error("MONGO_DBNAME must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[auth-service:rabbitmq]: Connected successfully`);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!, { dbName: process.env.MONGO_DBNAME! });
        console.log(`[auth-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        const gRPC = grpcServer(rabbitClient.connection).listen(`[auth-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);

        /** Create RabbitMQ consumers */
        await new UpdateEmployeeSigninConsumer(rabbitClient.connection).listen();
        await new CreateEmployeeSigninConsumer(rabbitClient.connection).listen();

        /** Shut down process */
        process.on("SIGINT", async () => {
            await rabbitClient.connection.close();
            await mongoose.connection.close();
            gRPC.m_server.forceShutdown();
        });
        process.on("SIGTERM", async () => {
            await rabbitClient.connection.close();
            await mongoose.connection.close();
            gRPC.m_server.forceShutdown();
        });
    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-service:error]: Service start up error -> ${msg}`);
        await LogPublisher.getPublisher(rabbitClient.connection, MicroServiceNames.EMPLOYEE_SERVICE, "employee-service:startup").publish(
            LogCodes.ERROR,
            msg.message || "Service Error",
            "main()",
            msg.stack! || "No stack trace"
        );
    }
}

main();