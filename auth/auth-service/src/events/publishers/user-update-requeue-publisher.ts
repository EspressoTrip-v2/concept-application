import { AbstractPublisher, BindKey, ExchangeNames, ExchangeTypes, LogCodes, UpdateUserEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class UserUpdateRequeuePublisher extends AbstractPublisher<UpdateUserEvent> {
    static m_instance: UserUpdateRequeuePublisher
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.AUTH_UPDATE = BindKey.AUTH_UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-employee");
    }

    static NewUserUpdateRequeuePublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new UserUpdateRequeuePublisher(rabbitChannel);
    }

    static userUpdateRequeuePublisher(): UserUpdateRequeuePublisher {
        if(!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `UpdateUserRequeuePublisher not created`,
                `auth/auth-service/src/events/publishers/update-user-requeue-publisher.ts:21`,
                "UserUpdateRequeuePublisher not created in application index.ts"
            );
            throw new Error("UserUpdateRequeuePublisher not created in application index.ts")
        }
        return this.m_instance;
    }

    async publish(data: UpdateUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
