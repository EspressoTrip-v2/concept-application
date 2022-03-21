import { AbstractPublisher, BindKey, ExchangeNames, ExchangeTypes, LogCodes, UpdateUserEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class UpdateUserPublisher extends AbstractPublisher<UpdateUserEvent> {
    static m_instance: UpdateUserPublisher;
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.AUTH_UPDATE = BindKey.AUTH_UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-user");
    }

    static NewUpdateUserPublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new UpdateUserPublisher(rabbitChannel);
    }

    static updateUserPublisher(): UpdateUserPublisher {
        if (!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `UpdateUserPublisher not created`,
                `employee/employee-service/src/events/publishers/update-user-publisher.ts:21`,
                "UpdateUserPublisher not created in application index.ts"
            );
            throw new Error("UpdateUserPublisher not created in application index.ts");
        }
        return this.m_instance;
    }

    async publish(data: UpdateUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
