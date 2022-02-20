import { AbstractConsumer, ExchangeNames, ExchangeTypes, LogEvent, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import winston from "winston";
import { Loggly } from "winston-loggly-bulk";

export class AllLogsConsumer extends AbstractConsumer<LogEvent> {
    m_exchangeName: ExchangeNames.LOG = ExchangeNames.LOG;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.LOG_EVENT = QueueInfo.LOG_EVENT;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "all-logs");
    }

    onMessage(data: LogEvent["data"], message: amqp.ConsumeMessage): void {
        const logData = JSON.parse(data.toString());
        winston.add(
            new Loggly({
                token: process.env.LOGGLY_TOKEN!,
                subdomain: process.env.LOGGLY_SUBDOMAIN!,
                tags: [logData.logContext, logData.service],
                json: true,
            })
        );

        winston.log("info", logData);
        this.acknowledge(message);
    }
}
