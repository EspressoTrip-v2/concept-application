import { AbstractPublisher, CreateEmployeeEvent, CreateUserEvent, DeleteEmployeeEvent, ExchangeNames, ExchangeTypes, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class CreateUserPublisher extends AbstractPublisher<CreateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_USER = QueueInfo.CREATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-user");
    }

    async publish(data: CreateUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
