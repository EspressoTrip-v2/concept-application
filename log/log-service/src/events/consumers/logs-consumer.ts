import { AbstractConsumer, BindKey, ExchangeNames, ExchangeTypes, LogEvent, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LogFactory, LogProviderTypes } from "../../log-providers";

export class LogsConsumer extends AbstractConsumer<LogEvent> {
    m_exchangeName: ExchangeNames.LOG = ExchangeNames.LOG;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.LOG_EVENT = QueueInfo.LOG_EVENT;
    m_logger = LogFactory.getLogger(process.env.LOG_PROVIDER_TYPE! as LogProviderTypes, "acme-fast");
    m_bindKey: BindKey.LOG = BindKey.LOG;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "all-logs");
    }

    onMessage(data: LogEvent["data"], message: amqp.ConsumeMessage): void {
        const logData = JSON.parse(data.toString());
        this.m_logger.createLog(logData);
    }
}
