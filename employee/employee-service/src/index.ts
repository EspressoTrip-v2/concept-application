import { grpcServer } from "./services";
import mongoose from "mongoose";
import { LogCodes, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import { UpdateEmployeeConsumer, UserSaveFailureConsumer } from "./events";
import { LocalLogger } from "./utils";

async function main(): Promise<void> {
    try {
        if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
        if (!process.env.MONGO_DBNAME) throw new Error("MONGO_DBNAME must be defined");
        if (!process.env.GRPC_SERVER_PORT) throw new Error("GRPC_SERVER_PORT must be defined");

        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!, `[employee-service:rabbitmq]: Connected successfully`);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!, { dbName: process.env.MONGO_DBNAME! });
        console.log(`[employee-service:mongo]: Connected successfully`);

        /** Create gRPC server */
        const gRPC = grpcServer(rabbitClient.connection).listen(`[employee-service:gRPC-server]: Listening on ${process.env.GRPC_SERVER_PORT}`);

        /** Rabbit Consumers */
        await new UserSaveFailureConsumer(rabbitClient.connection).listen();
        await new UpdateEmployeeConsumer(rabbitClient.connection).listen();

        /** Start logger */
        LocalLogger.start(rabbitClient.connection, MicroServiceNames.EMPLOYEE_SERVICE);

    } catch (error) {
        const msg = error as Error;
        console.log(`[employee-service:error]: Service start up error -> ${msg}`);
        LocalLogger.log(LogCodes.ERROR, msg.message || "Service Error", "main()", msg.stack! || "No stack trace");
    }
}

main();
