import { AbstractPublisher, ExchangeNames, ExchangeTypes, MicroServiceNames, QueueInfo, UpdateUserEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class UpdateUserPublisher extends AbstractPublisher<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.USERS = ExchangeNames.USERS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_USER = QueueInfo.UPDATE_USER;
    m_serviceName: MicroServiceNames.AUTH_SERVICE = MicroServiceNames.AUTH_SERVICE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-user");
    }
}
