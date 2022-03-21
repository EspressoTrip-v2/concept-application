import { AbstractConsumer, BindKey, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";
import { LocalLogger } from "../../utils";

export class UpdateEmployeeConsumer extends AbstractConsumer<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.UPDATE = BindKey.UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-employee");
    }

    nackMessage(message: amqp.ConsumeMessage): void {
        this.m_channel.ack(message);
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const employee = await Employee.updateByEvent(employeeData);
            if (employee) {
                LocalLogger.log(
                    LogCodes.UPDATED,
                    "Employee updated",
                    "employee/employee-service/src/events/consumers/update-employee-consumer.ts:20",
                    `email: ${employee.email}, authId: ${employee.authId}`
                );

                // Acknowledge message
                this.nackMessage(message);
                return;
            } else {
                LocalLogger.log(
                    LogCodes.ERROR,
                    "Employee not found",
                    "employee/employee-service/src/events/consumers/update-employee-consumer.ts:23",
                    `email: ${employeeData.email}, authId: ${employeeData.authId}`
                );
                return;
            }
        } catch (error) {
            LocalLogger.log(
                LogCodes.ERROR,
                "Consumer Error",
                "employee/employee-service/src/events/consumers/update-employee-consumer.ts:27",
                `error: ${(error as Error).message}`
            );
        }
    }
}
