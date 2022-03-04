import { AbstractConsumer, DeleteUserEvent, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { User } from "../../models";
import { LocalLogger } from "../../utils";

export class DeleteUserConsumer extends AbstractConsumer<DeleteUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.DELETE_USER = QueueInfo.DELETE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "delete-user");
    }

    async onMessage(data: DeleteUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const user = await User.findOneAndDelete({ email: employeeData.email });
            if (!user) {
                LocalLogger.log(LogCodes.ERROR, "User not found", "DeleteUserConsumer", `email: ${employeeData.email}, employeeId: ${employeeData.id}`);
                return this.acknowledge(message);
            }
            LocalLogger.log(LogCodes.DELETED, "User deleted", "DeleteUserConsumer", `email: ${user.email}, UserId: ${user.id}, employeeId: ${employeeData.id}`);
            return this.acknowledge(message);
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "DeleteUserConsumer", `error: ${(error as Error).message}`);
        }
    }
}
