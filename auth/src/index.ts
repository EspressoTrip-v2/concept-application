import "module-alias";
import { app } from "./app";
import { rabbitClient } from "./rabbitmq-client";
import { EnvError } from "@espressotrip-org/concept-common";
import { sqlClient } from "./sql-client";
import { userModel } from "./models";

const PORT = process.env.PORT || 3000;

/**
 * Starts product service
 * JWT_KEY - Kubernetes global secret
 * MONGO_URI - MongoDB URI for the product database
 * RABBIT_URI - RabbitMQ URI for the message event bus
 */
async function main(): Promise<void> {
    if (!process.env.SESSION_SECRET) throw new EnvError("SESSION_SECRET must be defined");
    if (!process.env.POSTGRES_PASSWORD) throw new EnvError("POSTGRES_PASSWORD must be defined");
    if (!process.env.RABBIT_URI) throw new EnvError("RABBIT_URI must be defined");

    try {
        /** Create RabbitMQ connection */
        await rabbitClient.connect(process.env.RABBIT_URI!);
        console.log(`[auth:rabbitmq]: Connected successfully`);

        /** Create MySQL connection */
        const mySql = await sqlClient.connect();
        console.log(`[auth:mysql]: Connected successfully`);

        await mySql.createORM("User", userModel);

        /** Process shutdown */
        process.on("SIGINT", () => {
            rabbitClient.connection.close();
            sqlClient.connection.close();
        });
        process.on("SIGTERM", () => {
            rabbitClient.connection.close();
            sqlClient.connection.close();
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
