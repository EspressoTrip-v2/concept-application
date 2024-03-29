import "./tracer";
import { app } from "./app";
import { LogCodes, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { LocalLogger } from "./utils";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");

        /** Create RabbitMQ connection */
        const rabbit = await rabbitClient.connect(process.env.RABBIT_URI!, `[auth-api:rabbitmq]: Connected successfully`);

        /** Start logger */
        const logChannel = await rabbit.addChannel("log");
        LocalLogger.start(logChannel, MicroServiceNames.ANALYTIC_API);
    } catch (error) {
        const msg = error as Error;
        console.log(`[analytic-api:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "analytic/analytic-api/srv/index.ts:22", msg.stack! || "No stack trace");
    }
}

app.listen(PORT, async () => {
    console.log(`[analytic-api:express-service]: Listening on port ${PORT}`);
});

main();
