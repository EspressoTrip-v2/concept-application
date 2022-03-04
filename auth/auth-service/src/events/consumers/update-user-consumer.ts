import { AbstractConsumer, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, QueueInfo, UpdateUserEvent, UserRoles } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";
import { LocalLogger } from "../../utils";

export class UpdateUserConsumer extends AbstractConsumer<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_USER = QueueInfo.UPDATE_USER;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-user");
    }

    async onMessage(data: UpdateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (!existingUser) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    `Sign-in user not found`,
                    `UpdateUserConsumer`,
                    `email: ${employeeData.email}, userRole: ${employeeData.userRole}`,
                );
                this.acknowledge(message);
                throw new Error("Sign-in user not found.");
            }

            existingUser.set(employeeData);
            await existingUser.save();
            LocalLogger.log(
                LogCodes.UPDATED,
                "User updated",
                "UpdateUserConsumer",
                `email: ${existingUser.email}, UserId: ${existingUser.id}, employeeId: ${employeeData.id}`,
            );
            this.acknowledge(message);
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "UpdateUserConsumer", `error: ${(error as Error).message}`);
        }
    }
}
