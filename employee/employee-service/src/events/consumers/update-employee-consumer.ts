import { AbstractConsumer, BindKey, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";
import { LocalLogger } from "../../utils";
import { UpdateEmployeeTaskPublisher } from "../publishers";

export class UpdateEmployeeConsumer extends AbstractConsumer<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.EMPLOYEE_UPDATE = BindKey.EMPLOYEE_UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-employee");
    }

    nackMessage(message: amqp.ConsumeMessage): void {
        this.m_channel.ack(message);
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const employee = await Employee.findByEvent(employeeData);
            if (employee) {
                delete employeeData.id
                employee.set({ ...employeeData });
                await employee.save();
                LocalLogger.log(
                    LogCodes.UPDATED,
                    "Employee updated",
                    "employee/employee-service/src/events/consumers/update-employee-consumer.ts:28",
                    `email: ${employee.email}, authId: ${employee.authId}`
                );

                // Acknowledge message
                this.nackMessage(message);
                const pubMessage = Employee.convertToMessage(employee, true);
                UpdateEmployeeTaskPublisher.updateEmployeeTaskPublisher().publish(pubMessage);
                return;
            } else {
                LocalLogger.log(
                    LogCodes.ERROR,
                    "Employee not found",
                    "employee/employee-service/src/events/consumers/update-employee-consumer.ts:41",
                    `email: ${employeeData.email}, authId: ${employeeData.authId}`
                );
                this.nackMessage(message);
                return;
            }
        } catch (error) {
            LocalLogger.log(
                LogCodes.ERROR,
                "Consumer Error",
                "employee/employee-service/src/events/consumers/update-employee-consumer.ts:51",
                `error: ${(error as Error).message}`
            );
        }
    }
}
