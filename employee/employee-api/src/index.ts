import { app } from "./app";
import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    try {
        /** RabbitMQ */
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
        console.log(`[auth-api:error]: Service start up error -> ${msg}`);
        await LogPublisher.getPublisher(rabbitClient.connection, MicroServiceNames.EMPLOYEE_API, "employee-api:startup").publish(
            LogCodes.ERROR,
            msg.message || "Service Error",
            "main()",
            msg.stack! || "No stack trace"
        );
    }
}

app.listen(PORT, async () => {
    console.log(`[auth-api:express-service]: Listening port ${PORT}`);
});

main();
