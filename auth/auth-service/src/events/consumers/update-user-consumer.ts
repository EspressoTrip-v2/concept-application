import {
    AbstractConsumer,
    PersonMsg,
    ExchangeNames,
    ExchangeTypes,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
    UpdateEmployeeEvent, UpdateUserEvent,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

export class UpdateUserConsumer extends AbstractConsumer<UpdateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, MicroServiceNames.AUTH_SERVICE, "update-user:consumer");

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async onMessage(data: UpdateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (!existingUser) {
                this.m_logger.publish(
                    LogCodes.ERROR,
                    `Sign-in user not found`,
                    `UpdateUserConsumer`,
                    `email: ${employeeData.email}, userRole: ${employeeData.userRole}`
                );
                throw new Error("Sign-in user not found.");
            }
            existingUser.set(employeeData);
            await existingUser.save();
            LogPublisher.getPublisher(this.m_connection, MicroServiceNames.AUTH_SERVICE, "update-employee-sigin:consumer").publish(
                LogCodes.UPDATED,
                "User updated",
                "UpdateUserConsumer",
                `email: ${existingUser.email}, id: ${existingUser.id}`
            );
            this.acknowledge(message);
        } catch (error) {
            this.m_logger.publish(LogCodes.ERROR, "Consumer Error", "UpdateUserConsumer", `error: ${(error as Error).message}`);
        }
    }
}
