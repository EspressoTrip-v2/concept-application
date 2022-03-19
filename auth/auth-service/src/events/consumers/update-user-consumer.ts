import { AbstractConsumer, BindKey, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, QueueInfo, UpdateUserEvent } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";
import { LocalLogger } from "../../utils";

export class UpdateUserConsumer extends AbstractConsumer<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_USER = QueueInfo.UPDATE_USER;
    m_bindKey: BindKey.UPDATE = BindKey.UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-user");
    }

    async onMessage(data: UpdateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (!existingUser) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    `Sign-in user not found`,
                    `auth/auth-service/src/events/consumers/update-user-consumer.ts:20`,
                    `email: ${employeeData.email}, userRole: ${employeeData.userRole}`,
                );
                throw new Error("Sign-in user not found.");
            }

            existingUser.set(employeeData);
            await existingUser.save();
            LocalLogger.log(
                LogCodes.UPDATED,
                "User updated",
                "auth/auth-service/src/events/consumers/update-user-consumer.ts:32",
                `email: ${existingUser.email}, UserId: ${existingUser.id}, employeeId: ${employeeData.id}`,
            );
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "auth/auth-service/src/events/consumers/update-user-consumer.ts:40", `error: ${(error as Error).message}`);
        }
    }
}
