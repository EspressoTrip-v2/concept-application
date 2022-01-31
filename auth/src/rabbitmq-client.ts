import amqp from "amqplib";
import { MongooseError } from "@common";

export class RabbitClient {
    private _connection?: amqp.Connection;

    get connection(): amqp.Connection {
        if (!this._connection) throw new MongooseError("RabbitMQ not connected");
        return this._connection;
    }

    get isConnected(): boolean {
        return !!this._connection;
    }

    /**
     * Connect to RabbitMQ Server
     * @param rabbitUrl {string} - RabbitMQ connection URL
     */
    async connect(rabbitUrl: string): Promise<RabbitClient> {
        this._connection = await amqp.connect(rabbitUrl);
        return this;
    }
}

export const rabbitConnection = new RabbitClient();
