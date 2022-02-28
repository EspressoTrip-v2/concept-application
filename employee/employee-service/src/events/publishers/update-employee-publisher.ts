import { AbstractPublisher, CreateEmployeeEvent, DeleteEmployeeEvent, ExchangeNames, ExchangeTypes, QueueInfo, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class UpdateEmployeePublisher extends AbstractPublisher<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async publish(data: UpdateEmployeeEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
