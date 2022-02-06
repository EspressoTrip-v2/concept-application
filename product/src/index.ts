import { app } from "./app";
import { rabbitClient } from "./rabbitmq-client";
import mongoose from "mongoose";
import { ProductUpdatedConsumer } from "./events";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

/**
 * Starts product service
 * JWT_KEY - Kubernetes global secret
 * MONGO_URI - MongoDB URI for the product database
 * RABBIT_URI - RabbitMQ URI for the message event bus
 */
async function main(): Promise<void> {
    if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
    if (!process.env.RABBIT_URI) throw new Error("RABBIT_URI must be defined");
    if (!process.env.BASE_URI) throw new Error("BASE_URI must be defined");

    try {
        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!);
        console.log(`[product:rabbitmq]: Connected successfully`);
        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!);
        console.log(`[product:mongo]: Connected successfully`);

        /** Process shutdown */
        process.on("SIGINT", () => {
            rabbitClient.connection.close();
            mongoose.connection.close();
        });
        process.on("SIGTERM", () => {
            rabbitClient.connection.close();
            mongoose.connection.close();
        });
        /** Rabbit consumers */
        await new ProductUpdatedConsumer(rabbitClient.connection).listen();
    } catch (error) {
        console.error(error);
    }
}

app.listen(PORT, async () => {
    console.log(`[product:service]: listening port ${PORT}`);
});
main();
