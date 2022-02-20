import {
    AbstractConsumer,
    ExchangeNames,
    ExchangeTypes,
    LogClientOptions,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
    UpdateEmployeeEvent,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

/** Logging Options */
const LOG_OPTIONS: LogClientOptions = {
    serviceName: MicroServiceNames.AUTH_SERVICE,
    publisherName: "auth-service-consumer:update-employee-signin",
};

export class UpdateEmployeeSigninConsumer extends AbstractConsumer<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, LOG_OPTIONS);

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingUser = await User.findOne({ email: data.email, userRole: data.userRole });
        if (!existingUser) {
            this.m_logger.publish({
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
