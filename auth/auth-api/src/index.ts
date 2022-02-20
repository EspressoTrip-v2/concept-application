import { app } from "./app";
import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    try {
        /** Google */
        if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID must be defined");
        if (!process.env.GOOGLE_SECRET) throw new Error("GOOGLE_SECRET must be defined");
        if (!process.env.GOOGLE_CALLBACK_URL) throw new Error("GOOGLE_CALLBACK must be defined");

        /** Github */
        if (!process.env.GITHUB_CLIENT_ID) throw new Error("GITHUB_CLIENT_ID must be defined");
        if (!process.env.GITHUB_SECRET) throw new Error("GITHUB_SECRET must be defined");
        if (!process.env.GITHUB_CALLBACK_URL) throw new Error("GITHUB_CALLBACK must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[auth-api:rabbitmq]: Connected successfully`);

        /** Shut down process */
        process.on("SIGTERM", async () => {
            await rabbitClient.connection.close();
        });
        process.on("SIGINT", async () => {
            await rabbitClient.connection.close();
        });
    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-api:error]: Service start up error -> ${msg}`);
        await LogPublisher.getPublisher(rabbitClient.connection, "auth-api:startup").publish({
            service: MicroServiceNames.ANALYTIC_API,
            logContext: LogCodes.ERROR,
            message: msg.message,
            details: msg.stack,
            origin: "main()",
            date: new Date().toISOString(),
        });
    }
}

app.listen(PORT, async () => {
    console.log(`[auth-api:express-service]: Listening port ${PORT}`);
});

main();
