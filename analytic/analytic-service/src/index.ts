import "./tracer";
import { grpcServer, postgresClient } from "./services";
import { LogCodes, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { LocalLogger } from "./utils";

async function main(): Promise<void> {
    try {
        if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.POSTGRES_SERVICE_NAME) throw new Error("POSTGRES_SERVICE_NAME must be defined");
        if (!process.env.POSTGRES_USERNAME) throw new Error("POSTGRES_USERNAME must be defined");
        if (!process.env.ANALYTIC_POSTGRES_PASSWORD) throw new Error("ANALYTIC_POSTGRES_PASSWORD must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");
        if (!process.env.POSTGRES_PORT) throw new Error("POSTGRES_PORT must be defined");

        /** Create RabbitMQ connection */
       const rabbit =  await rabbitClient.connect(process.env.RABBIT_URI!, `[analytic-service:rabbitmq]: Connected successfully`);

        /** Start logger */
        const logChannel = await rabbit.addChannel("log")
        LocalLogger.start(logChannel, MicroServiceNames.ANALYTIC_SERVICE);

        /** Create postgres connection */
        await postgresClient.connect(`[analytic-service:postgres]: Connected successfully`);

        /** Create gRPC server */
        const gRPC = grpcServer(rabbitClient.connection).listen(`[analytic-service:gRPC-server]: Listening port ${process.env.GRPC_SERVER_PORT}`);
    } catch (error) {
        const msg = error as Error;
        console.log(`[auth-service:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "analytic/analytic-service/srv/index.ts:31", msg.stack! || "No stack trace");
    }
}

main();
