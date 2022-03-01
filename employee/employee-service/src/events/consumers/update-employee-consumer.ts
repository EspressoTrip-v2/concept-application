import {
    AbstractConsumer,
    PersonMsg,
    ExchangeNames,
    ExchangeTypes,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
    UpdateEmployeeEvent,
} from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";

export class UpdateEmployeeConsumer extends AbstractConsumer<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const employee = await Employee.updateByEvent(employeeData);
            if (employee) {
                LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "update-employee:consumer").publish(
                    LogCodes.UPDATED,
                    "Employee updated",
                    "UpdateEmployeeConsumer",
                    `email: ${employee.email}, authId: ${employee.authId}`
                );
                return this.acknowledge(message);
            } else {
                LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "update-employee:consumer").publish(
                    LogCodes.ERROR,
                    "Employee not found",
                    "UpdateEmployeeConsumer",
                    `email: ${employeeData.email}, authId: ${employeeData.authId}`
                );
            }
        } catch (error) {
            LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "update-employee:consumer").publish(
                LogCodes.ERROR,
                "Consumer Error",
                "UpdateEmployeeConsumer",
                `error: ${(error as Error).message}`
            );
        }
    }
}
