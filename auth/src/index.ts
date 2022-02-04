import { app } from "./app";
import { rabbitClient } from "./rabbitmq-client";
import mongoose from "mongoose";
import { EnvError } from "@espressotrip-org/concept-common";

const PORT = process.env.PORT || 3000;

/**
 * Starts product service
 * JWT_KEY - Kubernetes global secret
 * MONGO_URI - MongoDB URI for the product database
 * RABBIT_URI - RabbitMQ URI for the message event bus
 */
async function main(): Promise<void> {
    if (!process.env.SESSION_SECRET) throw new EnvError("SESSION_SECRET must be defined");
    if (!process.env.RABBIT_URI) throw new EnvError("RABBIT_URI must be defined");
    if (!process.env.MONGO_URI) throw new EnvError("MONGO_URI must be defined");

    /** gRPC */
    // if (!process.env.GRPC_PORT) throw new EnvError("GRPC_PORT must be defined");

    /** Google */
    if (!process.env.GOOGLE_CLIENT_ID) throw new EnvError("GOOGLE_CLIENT_ID must be defined");
    if (!process.env.GOOGLE_SECRET) throw new EnvError("GOOGLE_SECRET must be defined");
    if (!process.env.GOOGLE_CALLBACK_URL) throw new EnvError("GOOGLE_CALLBACK must be defined");

    /** Github */
    if (!process.env.GITHUB_CLIENT_ID) throw new EnvError("GITHUB_CLIENT_ID must be defined");
    if (!process.env.GITHUB_SECRET) throw new EnvError("GITHUB_SECRET must be defined");
    if (!process.env.GITHUB_CALLBACK_URL) throw new EnvError("GITHUB_CALLBACK must be defined");

    /** Facebook */
    if (!process.env.FACEBOOK_CLIENT_ID) throw new EnvError("FACEBOOK_CLIENT_ID must be defined");
    if (!process.env.FACEBOOK_SECRET) throw new EnvError("FACEBOOK_SECRET must be defined");
    if (!process.env.FACEBOOK_CALLBACK_URL) throw new EnvError("FACEBOOK_CALLBACK must be defined");

    try {
        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!);
        console.log(`[auth:rabbitmq]: Connected successfully`);

        // /** Create Mongoose connection */
        await mongoose.connect(process.env.MONGO_URI!);
        console.log(`[auth:mongo]: Connected successfully`);

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
    } catch (error) {
        console.error(error);
    }
}

app.listen(PORT, async () => {
    console.log(`[auth:service]: listening port ${PORT}`);
});

main();
