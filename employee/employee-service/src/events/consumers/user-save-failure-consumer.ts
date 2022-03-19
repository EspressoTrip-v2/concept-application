import { AbstractConsumer, BindKey, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, SaveUserFailEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";
import { LocalLogger } from "../../utils";

export class UserSaveFailureConsumer extends AbstractConsumer<SaveUserFailEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.ERROR = BindKey.ERROR;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "user-save-failure");
    }

    async onMessage(data: SaveUserFailEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const employee = await Employee.findByIdAndDelete(employeeData.id);
            if (!employee) {
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "employee/employee-service/src/events/consumers/user-save-failure-consumer.ts:20", `email: ${employeeData.email}, UserId: ${employeeData.id}`);
                return
            }
            LocalLogger.log(LogCodes.DELETED, "Employee delete", "employee/employee-service/src/events/consumers/user-save-failure-consumer.ts:23", `email: ${employee.email}, UserId: ${employee.id}`);
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "employee/employee-service/src/events/consumers/user-save-failure-consumer.ts:26", `error: ${(error as Error).message}`);
        }
    }
}
