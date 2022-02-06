import { AbstractPublisher, ExchangeNames, ExchangeTypes, QueueInfo, UpdateUserEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class UpdateUserPublisher extends AbstractPublisher<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.USERS = ExchangeNames.USERS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_USER = QueueInfo.UPDATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-user");
    }
}
