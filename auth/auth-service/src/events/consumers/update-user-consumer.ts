import { AbstractConsumer, BindKey, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, UpdateUserEvent } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";
import { LocalLogger } from "../../utils";
import { UserUpdateRequeuePublisher } from "../publishers";

export class UpdateUserConsumer extends AbstractConsumer<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.AUTH_UPDATE = BindKey.AUTH_UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-user");
    }

    nackMessage(message: amqp.ConsumeMessage): void {
        this.m_channel.ack(message);
    }

    async onMessage(data: UpdateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (existingUser) {
                delete employeeData.id;
                existingUser.set({ ...employeeData });
                await existingUser.save();
                LocalLogger.log(
                    LogCodes.UPDATED,
                    "User updated",
                    "auth/auth-service/src/events/consumers/update-user-consumer.ts:28",
                    `email: ${existingUser.email}, UserId: ${existingUser.id}, employeeId: ${employeeData.id}`
                );
                // Acknowledge message
                this.nackMessage(message);
                return;
            }
            LocalLogger.log(
                LogCodes.ERROR,
                `Sign-in user not found`,
                `auth/auth-service/src/events/consumers/update-user-consumer.ts:38`,
                `email: ${employeeData.email}, userRole: ${employeeData.userRole}`
            );
            this.nackMessage(message);
            UserUpdateRequeuePublisher.userUpdateRequeuePublisher().publish(employeeData)
            return;
        } catch (error) {
            LocalLogger.log(
                LogCodes.ERROR,
                "Consumer Error",
                "auth/auth-service/src/events/consumers/update-user-consumer.ts:48",
                `error: ${(error as Error).message}`
            );
        }
    }
}
