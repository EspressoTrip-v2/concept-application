import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class LocalLogger {
    m_logger: LogPublisher;
    static m_instance: LocalLogger;
    private constructor(rabbitConnection: amqp.Connection, microserviceName: MicroServiceNames) {
        this.m_logger = new LogPublisher(rabbitConnection, microserviceName);
    }

    static start(rabbitConnection: amqp.Connection, microserviceName: MicroServiceNames): void {
        if (this.m_instance) return;
        this.m_instance = new LocalLogger(rabbitConnection, microserviceName);
    }

    static log(logCode: LogCodes, message: string, origin: string, details: string): void {
        if (!this.m_instance) throw new Error("Logger not started on application load.");
        this.m_instance.m_logger.publish(logCode, message, origin, details);
    }
}
