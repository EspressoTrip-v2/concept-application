import { AbstractPublisher, CreateUserEvent } from "@espressotrip-org/concept-common";
import { ExchangeNames, ExchangeTypes, QueueInfo } from "@common";
import amqp from "amqplib";

export class CreateUserPublisher extends AbstractPublisher<CreateUserEvent> {
    m_exchangeName: ExchangeNames.USERS = ExchangeNames.USERS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_USER = QueueInfo.CREATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-user");
    }
}
