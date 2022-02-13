import amqp from "amqplib";

export class RabbitClient {
    private m_connection?: amqp.Connection;

    get connection(): amqp.Connection {
        if (!this.m_connection) throw new Error("RabbitMQ not connected");
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
