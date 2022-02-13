import mongoose from "mongoose";
import { ProductCreatedConsumer, ProductUpdatedConsumer, ServiceStartupErrorPublisher, UserCreatedConsumer, UserUpdatedConsumer } from "./events";
import { grpcServer, rabbitClient } from "./clients";

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!);
        console.log(`[analytic-service:rabbitmq]: Connected successfully`);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!);
        console.log(`[auth-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        grpcServer.listen();

        /** Add RabbitMQ Listeners */
        await new ProductCreatedConsumer(rabbitClient.connection).listen();
        await new ProductUpdatedConsumer(rabbitClient.connection).listen();
        await new UserCreatedConsumer(rabbitClient.connection).listen();
        await new UserUpdatedConsumer(rabbitClient.connection).listen();
    } catch (error) {
        const message = (error as Error).message;

        console.log(`[auth-service:error]: Service start up error -> ${message}`);
        console.log(`[auth-service:error]: Shutting down`);

        await new ServiceStartupErrorPublisher(rabbitClient.connection).publish({
            errorMessage: message,
        });

        /** Shut down process */
        process.on("SIGINT", () => {
            rabbitClient.connection.close();
            mongoose.connection.close();
            grpcServer.m_server.forceShutdown();
        });
        process.on("SIGTERM", () => {
            rabbitClient.connection.close();
            mongoose.connection.close();
            grpcServer.m_server.forceShutdown();
        });
        process.exit(1);
    }
}

main();
