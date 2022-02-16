import { grpcServer } from "./clients";
import mongoose from "mongoose";
import { ServiceStartupErrorPublisher } from "./events/publishers";
import { rabbitClient } from "@espressotrip-org/concept-common";

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!,`[auth-service:rabbitmq]: Connected successfully`);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!);
        console.log(`[auth-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        grpcServer.listen(`[auth-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);
    } catch (error) {
        const message = (error as Error).message;

        console.log(`[auth-service:error]: Service start up error -> ${message}`);
        console.log(`[auth-service:error]: Shutting down`);

        await new ServiceStartupErrorPublisher(rabbitClient.connection).publish({
            errorMessage: message,
        });

        /** Shut down process */
        process.on("SIGINT", async () => {
            await rabbitClient.connection.close();
            await mongoose.connection.close();
            grpcServer.m_server.forceShutdown();
        });
        process.on("SIGTERM", async () => {
            await rabbitClient.connection.close();
            await mongoose.connection.close();
            grpcServer.m_server.forceShutdown();
        });
        process.exit(1);
    }
}

main();
