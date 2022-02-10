import { AbstractPublisher, CreateProductEvent, ExchangeNames, ExchangeTypes, MicroServiceNames, QueueInfo } from "@espressotrip-org/concept-common";
import amqp from "amqplib";

export class CreateProductPublisher extends AbstractPublisher<CreateProductEvent> {
    m_exchangeName: ExchangeNames.PRODUCTS = ExchangeNames.PRODUCTS;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_PRODUCT = QueueInfo.CREATE_PRODUCT;
    m_serviceName: MicroServiceNames.PRODUCT_SERVICE = MicroServiceNames.PRODUCT_SERVICE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-product");
    }
}
