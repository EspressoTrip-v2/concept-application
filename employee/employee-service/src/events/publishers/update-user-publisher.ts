import { AbstractPublisher, ExchangeNames, ExchangeTypes, QueueInfo, UpdateEmployeeEvent, UpdateUserEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class UpdateUserPublisher extends AbstractPublisher<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_USER = QueueInfo.UPDATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-user");
    }

    async publish(data: UpdateUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
