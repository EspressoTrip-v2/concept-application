import { AbstractPublisher, DeleteEmployeeEvent, ExchangeNames, ExchangeTypes, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class DeleteEmployeePublisher extends AbstractPublisher<DeleteEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.DELETE_EMPLOYEE = QueueInfo.DELETE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "delete-employee");
    }

    async publish(data: DeleteEmployeeEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
