import { AbstractPublisher, ExchangeNames, ExchangeTypes, QueueInfo, UpdateProductEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class UpdateProductPublisher extends AbstractPublisher<UpdateProductEvent> {
    m_exchangeName: ExchangeNames.PRODUCTS = ExchangeNames.PRODUCTS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_PRODUCT = QueueInfo.UPDATE_PRODUCT;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-product");
    }
}
