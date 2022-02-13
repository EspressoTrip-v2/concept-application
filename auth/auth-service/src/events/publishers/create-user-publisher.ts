import { AbstractPublisher, CreateUserEvent, ExchangeNames, ExchangeTypes, MicroServiceNames, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class CreateUserPublisher extends AbstractPublisher<CreateUserEvent> {
    m_exchangeName: ExchangeNames.USERS = ExchangeNames.USERS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_USER = QueueInfo.CREATE_USER;
    m_serviceName: MicroServiceNames.AUTH_SERVICE = MicroServiceNames.AUTH_SERVICE

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-user");
    }
}
