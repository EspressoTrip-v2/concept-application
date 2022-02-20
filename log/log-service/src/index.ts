import { rabbitClient } from "@espressotrip-org/concept-common";
import { AllLogsConsumer } from "./events";

async function main(): Promise<void> {
    try {
        if (!process.env.LOGGLY_SUBDOMAIN) throw new Error("LOGGLY_SUBDOMAIN must be defined");
        if (!process.env.LOGGLY_TOKEN) throw new Error("LOGGLY_TOKEN must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[log-service:rabbitmq]: Connected successfully`);

        /** Create RabbitMQ consumers */
        await new AllLogsConsumer(rabbitClient.connection).listen();

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
