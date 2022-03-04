import { AbstractPublisher, DeleteUserEvent, ExchangeNames, ExchangeTypes, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class DeleteUserPublisher extends AbstractPublisher<DeleteUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.DELETE_USER = QueueInfo.DELETE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "delete-user");
    }

    async publish(data: DeleteUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
