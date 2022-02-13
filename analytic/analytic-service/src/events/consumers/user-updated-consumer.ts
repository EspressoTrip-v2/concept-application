import amqp from "amqplib";
import { AbstractConsumer, CreateUserEvent, ExchangeNames, ExchangeTypes, QueueInfo, UpdateUserEvent } from "@espressotrip-org/concept-common";

export class UserUpdatedConsumer extends AbstractConsumer<UpdateUserEvent>{
    m_exchangeName: ExchangeNames.USERS = ExchangeNames.USERS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_USER = QueueInfo.UPDATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, 'update-user');
    }

    onMessage(data: UpdateUserEvent["data"], message: amqp.ConsumeMessage): void {
        console.log(`[analytic:message]: User updated`);
        console.log(JSON.parse(data.toString()));
        this.acknowledge(message);
    }

}