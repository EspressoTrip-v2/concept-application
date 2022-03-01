import { AbstractPublisher, ExchangeNames, ExchangeTypes, QueueInfo, SaveUserFailEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class UserSaveFailurePublisher extends AbstractPublisher<SaveUserFailEvent>{
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.AUTH_ERROR = QueueInfo.AUTH_ERROR;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, 'user-save-failure');
    }
    async publish(data: SaveUserFailEvent["data"]): Promise<void> {
        await this._publish(data);
    }

}