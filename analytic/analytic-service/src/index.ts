import { ServiceStartupErrorPublisher } from "./events";
import { grpcServer, postgresClient } from "./clients";
import { rabbitClient } from "@espressotrip-org/concept-common";

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.POSTGRES_SERVICE_NAME) throw new Error("POSTGRES_SERVICE_NAME must be defined");
        if (!process.env.POSTGRES_USERNAME) throw new Error("POSTGRES_USERNAME must be defined");
        if (!process.env.ANALYTIC_POSTGRES_PASSWORD) throw new Error("ANALYTIC_POSTGRES_PASSWORD must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[analytic-service:rabbitmq]: Connected successfully`);

        /** Create postgres connection */
        await postgresClient.connect(`[analytic-service:postgres]: Connected successfully`);

        /** Create gRPC server */
        grpcServer.listen(`[analytic-service:gRPC-server]: Listening port ${process.env.GRPC_SERVER_PORT}`);

        /** Shut down process */
        process.on("SIGINT", async () => {
            await rabbitClient.connection.close();
            grpcServer.m_server.forceShutdown();
            await postgresClient.close();
        });
        process.on("SIGTERM", async () => {
            await rabbitClient.connection.close();
            grpcServer.m_server.forceShutdown();
            await postgresClient.close();
        });

        /** Add RabbitMQ Listeners */
    } catch (error) {
        const msg = (error as Error);
        console.log(`[auth-service:error]: Service start up error -> ${msg}`);
        await new ServiceStartupErrorPublisher(rabbitClient.connection).publish({
            error: {
                name: msg.name,
                stack: msg.stack,
                message: msg.message,
            },
        });

    }
}

main();
