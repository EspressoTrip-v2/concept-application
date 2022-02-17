import { app } from "./app";
import { ServiceStartupErrorPublisher } from "./events/publishers";
import { rabbitClient } from "@espressotrip-org/concept-common";

const PORT = process.env.PORT || 3000;


async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!,`[auth-api:rabbitmq]: Connected successfully`);

    } catch (error) {
        const message = (error as Error).message;

        console.log(`[analytic-api:error]: Service start up error -> ${message}`);
        console.log(`[analytic-api:error]: Shutting down`);

        await new ServiceStartupErrorPublisher(rabbitClient.connection).publish({
            errorMessage: message,
        });

        /** Shut down process */
        process.on("SIGTERM", async () => {
            await rabbitClient.connection.close();
        });
        process.on("SIGINT", async () => {
            await rabbitClient.connection.close();
        });
        process.exit(1);
    }
}

app.listen(PORT, async () => {
    console.log(`[analytic-api:express-service]: Listening on port ${PORT}`);
});

main();