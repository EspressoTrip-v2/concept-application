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
import { Employee } from "../../models";

export class UpdateEmployeeSigninConsumer extends AbstractConsumer<UpdateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, MicroServiceNames.EMPLOYEE_SERVICE, "auth-service:consumer-update-employee-signin");

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingUser = await Employee.findOne({ email: data.email, userRole: data.userRole });
        if (!existingUser) {
            this.m_logger.publish(
                LogCodes.ERROR,
                `Employee sign-in created`,
                "UpdateEmployeeSigninConsumer",
                `email: ${data.email}, userRole: ${data.userRole}`
            );
            throw new Error("Sign-in user not found.");
        }
        existingUser.set(data);
        await existingUser.save().catch(error => {
            if (error) {
                this.m_logger.publish(
                    LogCodes.CREATED,
                    "Could not save new employee",
                    "CreateEmployeeSigninConsumer",
                    `email: ${existingUser.email}, id: ${existingUser.id}`
                );
            }
        });

        this.acknowledge(message);
    }
}
