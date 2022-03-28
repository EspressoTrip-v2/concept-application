import "./tracer/tracer";
import { LogCodes, MicroServiceNames, RabbitClient, rabbitClient } from "@espressotrip-org/concept-common";
import { app } from "./app";
import { LocalLogger } from "./utils";
import { GrpcUserClient } from "./services";

const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    let rabbit: RabbitClient | undefined;
    let gRPC: GrpcUserClient | undefined;
    try {
        /** gRPC Client */
        gRPC = GrpcUserClient.getClient();
        gRPC.connect("[auth-api:gRPC-client]: ");
        /** RabbitMQ */
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        /** Google */
        if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID must be defined");
        if (!process.env.GOOGLE_SECRET) throw new Error("GOOGLE_SECRET must be defined");
        if (!process.env.EMPLOYEE_GOOGLE_CALLBACK_URL) throw new Error("EMPLOYEE_GOOGLE_CALLBACK_URL must be defined");

        /** Github */
        if (!process.env.EMPLOYEE_GITHUB_CLIENT_ID) throw new Error("EMPLOYEE_GITHUB_CLIENT_ID must be defined");
        if (!process.env.EMPLOYEE_GITHUB_SECRET) throw new Error("EMPLOYEE_GITHUB_SECRET must be defined");
        if (!process.env.EMPLOYEE_GITHUB_CALLBACK_URL) throw new Error("EMPLOYEE_GITHUB_CALLBACK_URL must be defined");

        /** Create RabbitMQ connection */
        rabbit = await rabbitClient.connect(process.env.RABBIT_URI!, `[auth-api:rabbitmq]: Connected successfully`);

        /** Start logger */
        const logChannel = await rabbit.addChannel("log");
        LocalLogger.start(logChannel, MicroServiceNames.AUTH_API);
    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-api:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "employee-dash/employee-dash-api/src/index.ts:37", msg.stack! || "No stack trace");
        if (rabbit) await rabbit.connection.close();
        if (gRPC) gRPC.m_client.close();
    }
}

app.listen(PORT, async () => {
    console.log(`[auth-api:express-service]: Listening port ${PORT}`);
});

main();
