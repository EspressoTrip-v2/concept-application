import amqp from "amqplib";
import { RabbitmqError } from "@espressotrip-org/concept-common";

export class RabbitClient {
    private m_connection?: amqp.Connection;

    get connection(): amqp.Connection {
        if (!this.m_connection) throw new RabbitmqError("RabbitMQ not connected");
        return this.m_connection;
    }

    get isConnected(): boolean {
        return !!this.m_connection;
    }

    /**
     * Connect to RabbitMQ Server
     * @param rabbitUrl {string} - RabbitMQ connection URL
     */
    async connect(rabbitUrl: string): Promise<RabbitClient> {
        this.m_connection = await amqp.connect(rabbitUrl);
        return this;
    }
}
export const rabbitClient = new RabbitClient();
