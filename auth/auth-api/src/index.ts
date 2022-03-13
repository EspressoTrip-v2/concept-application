import "./tracer";
import { LogCodes, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { app } from "./app";
import { LocalLogger } from "./utils";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    try {
        /** RabbitMQ */
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
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

        /** Start logger */
        LocalLogger.start(rabbitClient.connection, MicroServiceNames.AUTH_API);
    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-api:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "auth/auth-api/srv/index.ts:27", msg.stack! || "No stack trace");
    }
}

app.listen(PORT, async () => {
    console.log(`[auth-api:express-service]: Listening port ${PORT}`);
});

main();
