import "./tracer";
import { app } from "./app";
import { LogCodes, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { LocalLogger } from "./utils";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    try {
        /** RabbitMQ */
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[employee-api:rabbitmq]: Connected successfully`);

        /** Start logger */
        LocalLogger.start(rabbitClient.connection, MicroServiceNames.EMPLOYEE_API);
    } catch (error) {
        const msg = error as Error;
        console.log(`[employee-api:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "employee/employee-api/src/index.ts:22", msg.stack! || "No stack trace");
    }
}

app.listen(PORT, async () => {
    console.log(`[employee-api:express-service]: Listening port ${PORT}`);
});

main();
