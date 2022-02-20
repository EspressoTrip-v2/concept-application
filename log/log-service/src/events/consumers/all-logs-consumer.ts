import { AbstractConsumer, ExchangeNames, ExchangeTypes, LogEvent, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LogFactory, LogProviderTypes } from "../../log-providers";

export class AllLogsConsumer extends AbstractConsumer<LogEvent> {
    m_exchangeName: ExchangeNames.LOG = ExchangeNames.LOG;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.LOG_EVENT = QueueInfo.LOG_EVENT;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "all-logs");
    }

    onMessage(data: LogEvent["data"], message: amqp.ConsumeMessage): void {
        const logData = JSON.parse(data.toString());
        const logger = LogFactory.getLogger(process.env.LOG_PROVIDER_TYPE! as LogProviderTypes);
        logger.createLog(logData);
        this.acknowledge(message);
    }
}
