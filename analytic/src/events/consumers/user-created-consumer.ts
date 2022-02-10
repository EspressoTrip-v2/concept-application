import amqp from "amqplib";
import { AbstractConsumer, CreateUserEvent, ExchangeNames, ExchangeTypes, QueueInfo, UpdateUserEvent } from "@espressotrip-org/concept-common";

export class UserCreatedConsumer extends AbstractConsumer<CreateUserEvent>{
    m_exchangeName: ExchangeNames.USERS = ExchangeNames.USERS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_USER = QueueInfo.CREATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, 'created-user');
    }

    onMessage(data: CreateUserEvent["data"], message: amqp.ConsumeMessage): void {
        console.log(`[analytic:message]: User Created`);
        console.log(typeof data);
        console.log(data);
        this.acknowledge(message);
    }

}