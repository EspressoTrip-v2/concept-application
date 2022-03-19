import { LogCodes, LogPublisher, MicroServiceNames } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class LocalLogger {
    static m_instance: LocalLogger;
    m_logger: LogPublisher;

    private constructor(rabbitChannel: amqp.Channel, microserviceName: MicroServiceNames) {
        this.m_logger = new LogPublisher(rabbitChannel, microserviceName);
    }

    static start(rabbitChannel: amqp.Channel, microserviceName: MicroServiceNames): void {
        if (this.m_instance) return;
        this.m_instance = new LocalLogger(rabbitChannel, microserviceName);
    }

    static log(logCode: LogCodes, message: string, origin: string, details: string): void {
        if (!this.m_instance) throw new Error("Logger not started on application load.");
        this.m_instance.m_logger.publish(logCode, message, origin, details);
    }
}
