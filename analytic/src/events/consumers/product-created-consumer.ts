import { AbstractConsumer, CreateProductEvent, ExchangeNames, ExchangeTypes, QueueInfo, UpdateProductEvent } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class ProductCreatedConsumer extends AbstractConsumer<CreateProductEvent> {
    m_exchangeName: ExchangeNames.PRODUCTS = ExchangeNames.PRODUCTS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_PRODUCT = QueueInfo.CREATE_PRODUCT;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "created-product");
    }

    onMessage(data: CreateProductEvent["data"], message: amqp.ConsumeMessage): void {
        console.log(`[analytic:message]: Product updated`);
        console.log(typeof data);
        console.log(data);
        this.acknowledge(message)
    }
}
