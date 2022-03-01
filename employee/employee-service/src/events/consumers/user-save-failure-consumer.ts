import {
    AbstractConsumer,
    PersonMsg,
    ExchangeNames,
    ExchangeTypes,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
    SaveUserFailEvent,
} from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";

export class UserSaveFailureConsumer extends AbstractConsumer<SaveUserFailEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.AUTH_ERROR = QueueInfo.AUTH_ERROR;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "user-save-failure");
    }

    async onMessage(data: SaveUserFailEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const employee = await Employee.findByIdAndDelete(employeeData.id);
            if (!employee) {
                LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "user-save-failure:consumer").publish(
                    LogCodes.ERROR,
                    "Employee not found",
                    "EmployeeSaveFailureListener",
                    `email: ${employeeData.email}, id: ${employeeData.id}`
                );
                return this.acknowledge(message);
            }
            LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "user-save-failure:consumer").publish(
                LogCodes.DELETED,
                "Employee delete",
                "UserSaveFailureConsumer",
                `email: ${employee.email}, id: ${employee.id}`
            );
            this.acknowledge(message);
        } catch (error) {
            LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "user-save-failure:consumer").publish(
                LogCodes.ERROR,
                "Consumer Error",
                "UserSaveFailureConsumer",
                `error: ${(error as Error).message}`
            );
        }
    }
}
