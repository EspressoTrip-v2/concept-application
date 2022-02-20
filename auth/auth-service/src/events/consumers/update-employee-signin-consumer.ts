import {
    AbstractConsumer,
    ExchangeNames,
    ExchangeTypes,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
    UpdateEmployeeEvent,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

export class UpdateEmployeeSigninConsumer extends AbstractConsumer<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, "auth-service:consumer-update-employee-signin");

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingUser = await User.findOne({ email: data.email, userRole: data.userRole });
        if (!existingUser) {
            this.m_logger.publish({
                service: MicroServiceNames.AUTH_SERVICE,
                logContext: LogCodes.ERROR,
                message: `User not found`,
                details: `email: ${data.email}, userRole: ${data.userRole}`,
                origin: "UpdateEmployeeSigninConsumer",
                date: new Date().toISOString(),
            });
            throw new Error("User not found.");
        }
        existingUser.set(data);
        await existingUser.save();

        this.acknowledge(message);
    }
}
