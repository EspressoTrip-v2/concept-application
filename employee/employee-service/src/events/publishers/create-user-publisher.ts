import { AbstractPublisher, BindKey, CreateUserEvent, ExchangeNames, ExchangeTypes, LogCodes } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class CreateUserPublisher extends AbstractPublisher<CreateUserEvent> {
    static m_instance: CreateUserPublisher;
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.CREATE = BindKey.CREATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "create-user");
    }

    static NewCreateUserPublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new CreateUserPublisher(rabbitChannel);
    }

    static createUserPublisher(): CreateUserPublisher {
        if (!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `CreateUserPublisher not created`,
                `employee/employee-service/src/events/publishers/create-user-publisher.ts:23`,
                "CreateUserPublisher not created in application index.ts"
            );
            throw new Error("CreateUserPublisher not created in application index.ts");
        }
        return this.m_instance;
    }

    async publish(data: CreateUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
