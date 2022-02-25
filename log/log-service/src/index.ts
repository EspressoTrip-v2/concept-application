import { rabbitClient } from "@espressotrip-org/concept-common";
import { LogsConsumer } from "./events";

async function main(): Promise<void> {
    try {
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.LOG_PROVIDER_TYPE) throw new Error("LOG_PROVIDER_TYPE must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[log-service:rabbitmq]: Connected successfully`);

        /** Create RabbitMQ consumers */
        await new LogsConsumer(rabbitClient.connection).listen();

        /** Shut down process */
        process.on("SIGINT", async () => {
            await rabbitClient.connection.close();
        });
        process.on("SIGTERM", async () => {
            await rabbitClient.connection.close();
        });
    } catch (error) {
        const msg = error as Error;
        console.log(`[log-service:error]: Service start up error -> ${msg}`);
    }
}

main();
