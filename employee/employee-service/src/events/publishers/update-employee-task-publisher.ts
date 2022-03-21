import { AbstractPublisher, BindKey, ExchangeNames, ExchangeTypes, LogCodes, UpdateTaskEmployeeEvent, UpdateUserEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class UpdateEmployeeTaskPublisher extends AbstractPublisher<UpdateTaskEmployeeEvent> {
    static m_instance: UpdateEmployeeTaskPublisher;
    m_exchangeName: ExchangeNames.TASK = ExchangeNames.TASK;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.TASK_EMP_UPDATE = BindKey.TASK_EMP_UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-employee-task");
    }

    static NewUpdateEmployeeTaskPublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new UpdateEmployeeTaskPublisher(rabbitChannel);
    }

    static updateEmployeeTaskPublisher(): UpdateEmployeeTaskPublisher {
        if (!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `UpdateEmployeeTaskPublisher not created`,
                `employee/employee-service/src/events/publishers/update-employee-task-publisher.ts:21`,
                "UpdateEmployeeTaskPublisher not created in application index.ts"
            );
            throw new Error("UpdateEmployeeTaskPublisher not created in application index.ts");
        }
        return this.m_instance;
    }

    async publish(data: UpdateUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
