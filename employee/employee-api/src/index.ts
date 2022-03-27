import "./tracer/tracer";
import { app } from "./app";
import { LogCodes, MicroServiceNames, RabbitClient, rabbitClient } from "@espressotrip-org/concept-common";
import { LocalLogger } from "./utils";
import { GrpcEmployeeClient } from "./services";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    let rabbit: RabbitClient | undefined
    let gRPC: GrpcEmployeeClient | undefined
    try {
        /** gRPC Client */
        gRPC = GrpcEmployeeClient.getClient()
        gRPC.connect("[employee-api:gRPC-client]: ");

        /** RabbitMQ */
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");

        /** Create RabbitMQ connection */
        rabbit = await rabbitClient.connect(process.env.RABBIT_URI!, `[employee-api:rabbitmq]: Connected successfully`);

        /** Start logger */
        const logChannel = await rabbit.addChannel("log");
        LocalLogger.start(logChannel, MicroServiceNames.EMPLOYEE_API);
    } catch (error) {
        const msg = error as Error;
        console.log(`[employee-api:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "employee/employee-api/src/index.ts:30", msg.stack! || "No stack trace");
        if (rabbit) await rabbit.connection.close()
        if(gRPC) gRPC.m_client.close()
    }
}

app.listen(PORT, async () => {
    console.log(`[employee-api:express-service]: Listening port ${PORT}`);
});

main();
