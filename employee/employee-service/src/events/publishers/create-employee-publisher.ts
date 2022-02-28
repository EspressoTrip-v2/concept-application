import { AbstractPublisher, CreateEmployeeEvent, DeleteEmployeeEvent, ExchangeNames, ExchangeTypes, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class CreateEmployeePublisher extends AbstractPublisher<CreateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_EMPLOYEE = QueueInfo.CREATE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "delete-employee");
    }

    async publish(data: CreateEmployeeEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
