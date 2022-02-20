import { app } from "./app";
import { LogClientOptions, LogCodes, LogPublisher, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";

const PORT = process.env.PORT || 3000;

/** Logging Options */
const LOG_OPTIONS: LogClientOptions = {
    serviceName: MicroServiceNames.ANALYTIC_API,
    publisherName: "analytic-api-application:start",
};

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");

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
        console.log(`[analytic-api:error]: Service start up error -> ${msg}`);
        LogPublisher.getPublisher(rabbitClient.connection, LOG_OPTIONS).publish({
            service: MicroServiceNames.ANALYTIC_API,
            logContext: LogCodes.ERROR,
            message: msg.message,
            details: msg.stack,
            origin: "main",
            date: new Date().toISOString(),
        });
    }
}

app.listen(PORT, async () => {
    console.log(`[analytic-api:express-service]: Listening on port ${PORT}`);
});

main();
