import { app } from "./app";
import { rabbitConnection } from "./rabbitmq-client";
import mongoose from "mongoose";
import { EnvError } from "@espressotrip-org/concept-common";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

/**
 * Starts product service
 * JWT_KEY - Kubernetes global secret
 * MONGO_URI - MongoDB URI for the product database
 * RABBIT_URI - RabbitMQ URI for the message event bus
 */
async function main(): Promise<void> {
    if (!process.env.JWT_KEY) throw new EnvError("JWY_KEY must be defined");
    if (!process.env.MONGO_URI) throw new EnvError("MONGO_URI must be defined");
    if (!process.env.RABBIT_URI) throw new EnvError("RABBIT_URI must be defined");

    try {
        /** Create RabbitMQ connection */
        await rabbitConnection.connect(process.env.Rabbit_URI!);
        process.on("SIGTERM", () => rabbitConnection.connection.close());
        process.on("SIGINT", () => rabbitConnection.connection.close());

        /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!);
        console.log(`[product:mongo]: Connected successfully`);

    } catch (error) {
        console.error(error)
    }
}

app.listen(PORT, async () => {
    console.log(`[product:service]: listening port ${PORT}`);
});

main();
