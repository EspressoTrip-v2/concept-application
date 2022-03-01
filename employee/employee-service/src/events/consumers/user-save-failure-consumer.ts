import { AbstractConsumer, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg, QueueInfo, SaveUserFailEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { Employee } from "../../models";
import { LocalLogger } from "../../utils";

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
                LocalLogger.log(LogCodes.ERROR, "Employee not found", "EmployeeSaveFailureListener", `email: ${employeeData.email}, id: ${employeeData.id}`);
                return this.acknowledge(message);
            }
            LocalLogger.log(LogCodes.DELETED, "Employee delete", "UserSaveFailureConsumer", `email: ${employee.email}, id: ${employee.id}`);
            this.acknowledge(message);
        } catch (error) {
            LocalLogger.log(LogCodes.ERROR, "Consumer Error", "UserSaveFailureConsumer", `error: ${(error as Error).message}`);
        }
    }
}
