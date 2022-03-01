import { grpcServer } from "./services";
import mongoose from "mongoose";
import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { UpdateEmployeeConsumer, UserSaveFailureConsumer } from "./events";

async function main(): Promise<void> {
    try {
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.MONGO_DBNAME) throw new Error("MONGO_DBNAME must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[employee-service:rabbitmq]: Connected successfully`);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!, { dbName: process.env.MONGO_DBNAME! });
        console.log(`[employee-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        const gRPC = grpcServer(rabbitClient.connection).listen(`[employee-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);

        /** Rabbit Consumers */
        await new UserSaveFailureConsumer(rabbitClient.connection).listen();
        await new UpdateEmployeeConsumer(rabbitClient.connection).listen();
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
        console.log(`[employee-service:error]: Service start up error -> ${msg}`);
        await LogPublisher.getPublisher(rabbitClient.connection, MicroServiceNames.EMPLOYEE_SERVICE, "employee-service:startup").publish(
            LogCodes.ERROR,
            msg.message || "Service Error",
            "main()",
            msg.stack! || "No stack trace"
        );
    }
}

main();
