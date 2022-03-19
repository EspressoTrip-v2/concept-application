import { AbstractConsumer, BindKey, DeleteUserEvent, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { User } from "../../models";
import { LocalLogger } from "../../utils";

export class DeleteUserConsumer extends AbstractConsumer<DeleteUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.DELETE = BindKey.DELETE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "delete-user");
    }

    async onMessage(data: DeleteUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const user = await User.findOneAndDelete({ email: employeeData.email });
            if (!user) {
                LocalLogger.log(LogCodes.ERROR, "User not found", "auth/auth-service/src/events/consumers/delete-user-consumer.ts:20", `email: ${employeeData.email}, employeeId: ${employeeData.id}`);
                return
            }
            LocalLogger.log(LogCodes.DELETED, "User deleted", "auth/auth-service/src/events/consumers/delete-user-consumer.ts:23", `email: ${user.email}, UserId: ${user.id}, employeeId: ${employeeData.id}`);
            return
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "auth/auth-service/src/events/consumers/delete-user-consumer.ts:26", `error: ${(error as Error).message}`);
        }
    }
}
