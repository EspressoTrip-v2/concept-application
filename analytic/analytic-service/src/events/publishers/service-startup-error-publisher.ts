import { AbstractPublisher, ExchangeNames, ExchangeTypes, MicroServiceNames, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { ServiceErrorEvent } from "@espressotrip-org/concept-common/build/events/interfaces";

export class ServiceStartupErrorPublisher extends AbstractPublisher<ServiceErrorEvent> {
    m_exchangeName: ExchangeNames.SERVICE_ERRORS = ExchangeNames.SERVICE_ERRORS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.SERVICE_ERROR = QueueInfo.SERVICE_ERROR;
    m_serviceName: MicroServiceNames.ANALYTIC_SERVICE = MicroServiceNames.ANALYTIC_SERVICE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "analytic-service-startup");
    }
}
