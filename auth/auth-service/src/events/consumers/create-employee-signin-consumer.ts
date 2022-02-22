import {
    AbstractConsumer,
    CreateEmployeeEvent,
    ExchangeNames,
    ExchangeTypes,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

export class CreateEmployeeSigninConsumer extends AbstractConsumer<CreateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_EMPLOYEE = QueueInfo.CREATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, MicroServiceNames.AUTH_SERVICE, "auth-service:consumer-create-employee-signin");

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-employee");
    }

    async onMessage(data: CreateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingEmployee = await User.findOne({ email: data.email, userRole: data.userRole });
        if (existingEmployee) {
            this.m_logger.publish(
                LogCodes.ERROR,
                `Employee sign-in already exists`,
                `CreateEmployeeSigninConsumer`,
                `email: ${existingEmployee.email}, id: ${existingEmployee.id}`
            );
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
        await user.save().catch(error => {
            if (error) {
                this.m_logger.publish(LogCodes.ERROR, "Could not save employee as new user sign-in", "CreateEmployeeSigninConsumer", `email: ${user?.email}`);
            }
        });

        this.m_logger.publish(
            LogCodes.CREATED,
            `Employee saved as new user sign-in created`,
            `CreateEmployeeSigninConsumer`,
            `email: ${user.email}, id: ${user.id}`
        );

        this.acknowledge(message);
    }
}
