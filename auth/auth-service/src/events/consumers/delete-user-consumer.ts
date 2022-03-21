import { AbstractConsumer, BindKey, DeleteUserEvent, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { User } from "../../models";
import { LocalLogger } from "../../utils";

export class DeleteUserConsumer extends AbstractConsumer<DeleteUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.AUTH_DELETE = BindKey.AUTH_DELETE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "delete-user");
    }

    nackMessage(message: amqp.ConsumeMessage): void {
        this.m_channel.ack(message);
    }

    async onMessage(data: DeleteUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const user = await User.findOneAndDelete({ email: employeeData.email });
            if (!user) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    "User not found",
                    "auth/auth-service/src/events/consumers/delete-user-consumer.ts:24",
                    `email: ${employeeData.email}, employeeId: ${employeeData.id}`
                );
                this.nackMessage(message)
                return;
            }
            LocalLogger.log(
                LogCodes.DELETED,
                "User deleted",
                "auth/auth-service/src/events/consumers/delete-user-consumer.ts:33",
                `email: ${user.email}, UserId: ${user.id}, employeeId: ${employeeData.id}`
            );
            // Acknowledge message
            this.nackMessage(message);
            return;
        } catch (error) {
            LocalLogger.log(
                LogCodes.ERROR,
                "Consumer Error",
                "auth/auth-service/src/events/consumers/delete-user-consumer.ts:43",
                `error: ${(error as Error).message}`
            );
        }
    }
}
