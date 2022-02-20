import {
    AbstractConsumer,
    CreateEmployeeEvent,
    ExchangeNames,
    ExchangeTypes,
    LogClientOptions,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

/** Logging Options */
const LOG_OPTIONS: LogClientOptions = {
    serviceName: MicroServiceNames.AUTH_SERVICE,
    publisherName: "auth-service-consumer:create-employee-signin",
};

export class CreateEmployeeSigninConsumer extends AbstractConsumer<CreateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_EMPLOYEE = QueueInfo.CREATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, LOG_OPTIONS);

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-employee");
    }

    async onMessage(data: CreateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingEmployee = await User.findOne({ email: data.email, userRole: data.userRole });
        if (existingEmployee) {
            this.m_logger.publish({
                logContext: LogCodes.ERROR,
                message: `Employee sign-in already exists`,
                details: `email: ${existingEmployee.email}, id: ${existingEmployee.id}`,
                origin: `CreateEmployeeSigninConsumer`,
                date: new Date().toISOString(),
            });

            throw new Error("CreateEmployeeSignIn: Employee sign-in already exists.");
        }

        const user = User.build({
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            race: data.race,
            position: data.position,
            startDate: data.startDate,
            shiftPreference: data.shiftPreference,
            branchName: data.branchName,
            region: data.region,
            country: data.country,
            phoneNumber: data.phoneNumber,
            email: data.email,
            signInType: data.signInType,
            userRole: data.userRole,
            password: data.password,
            providerId: data.providerId,
        });
        await user.save();
        this.m_logger.publish({
            logContext: LogCodes.CREATED,
            message: `Employee sign-in created`,
            details: `email: ${user.email}, id: ${user.id}`,
            origin: `CreateEmployeeSigninConsumer`,
            date: new Date().toISOString(),
        });
        this.acknowledge(message);
    }
}
