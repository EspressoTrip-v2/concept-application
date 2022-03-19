import { AbstractPublisher, BindKey, ExchangeNames, ExchangeTypes, LogCodes, QueueInfo, SaveUserFailEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class UserSaveFailurePublisher extends AbstractPublisher<SaveUserFailEvent> {
    static m_instance: UserSaveFailurePublisher | undefined
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.AUTH_ERROR = QueueInfo.AUTH_ERROR;
    m_bindKey: BindKey.ERROR = BindKey.ERROR;

    private constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "user-save-failure");
    }

    static NewUserSaveFailurePublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new UserSaveFailurePublisher(rabbitChannel);
    }

    static userFailurePublisher(): UserSaveFailurePublisher {
        if(!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `UserSaveFailurePublisher not created`,
                `auth/auth-service/src/events/publishers/user-save-failure-publisher.ts:22`,
                "UserSaveFailurePublisher not created in application index.ts"
            );
            throw new Error("UserSaveFailurePublisher not created in application index.ts")
        }
        return this.m_instance;
    }

    async publish(data: SaveUserFailEvent["data"]): Promise<void> {
        await this._publish(data);
    }

}