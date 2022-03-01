import { AbstractConsumer, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, QueueInfo, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";
import { LocalLogger } from "../../utils";

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
                LocalLogger.log(LogCodes.UPDATED, "Employee updated", "UpdateEmployeeConsumer", `email: ${employee.email}, authId: ${employee.authId}`);
                return this.acknowledge(message);
            } else {
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "UpdateEmployeeConsumer", `email: ${employeeData.email}, authId: ${employeeData.authId}`);
                return this.acknowledge(message);
            }
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "UpdateEmployeeConsumer", `error: ${(error as Error).message}`);
        }
    }
}
