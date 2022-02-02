import { AbstractConsumer, ExchangeNames, ExchangeTypes, QueueInfo, UpdateProductEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class ProductUpdatedConsumer extends AbstractConsumer<UpdateProductEvent> {
    m_exchangeName: ExchangeNames.PRODUCTS = ExchangeNames.PRODUCTS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_PRODUCT = QueueInfo.UPDATE_PRODUCT;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-product");
    }

    onMessage(data: UpdateProductEvent["data"], message: amqp.ConsumeMessage): void {

        this.acknowledge(message)
    }
}
