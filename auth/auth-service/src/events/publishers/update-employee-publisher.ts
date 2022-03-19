import { AbstractPublisher, BindKey, ExchangeNames, ExchangeTypes, LogCodes, QueueInfo, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class UpdateEmployeePublisher extends AbstractPublisher<UpdateEmployeeEvent> {
    static m_instance: UpdateEmployeePublisher
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;
    m_bindKey: BindKey.UPDATE = BindKey.UPDATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "update-employee");
    }

    static NewUpdateEmployeePublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new UpdateEmployeePublisher(rabbitChannel);
    }

    static updateEmployeePublisher(): UpdateEmployeePublisher {
        if(!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `UpdateEmployeePublisher not created`,
                `auth/auth-service/src/events/publishers/update-employee-publisher.ts:22`,
                "UpdateEmployeePublisher not created in application index.ts"
            );
            throw new Error("UpdateEmployeePublisher not created in application index.ts")
        }
        return this.m_instance;
    }

    async publish(data: UpdateEmployeeEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
