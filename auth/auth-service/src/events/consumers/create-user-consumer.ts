import {
    AbstractConsumer,
    CreateEmployeeEvent,
    PersonMsg,
    ExchangeNames,
    ExchangeTypes,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    QueueInfo,
    rabbitClient,
    UserRoles, CreateUserEvent,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";
import { UpdateEmployeePublisher, UserSaveFailurePublisher } from "../publishers";

export class CreateUserConsumer extends AbstractConsumer<CreateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_EMPLOYEE = QueueInfo.CREATE_EMPLOYEE;
    private m_logger = LogPublisher.getPublisher(this.m_connection, MicroServiceNames.AUTH_SERVICE, "create-user:consumer");

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-employee");
    }

    async onMessage(data: CreateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (existingUser && existingUser.userRole === UserRoles.EMPLOYEE) {
                this.m_logger.publish(
                    LogCodes.ERROR,
                    `Employee sign-in already exists`,
                    `CreateUserConsumer`,
                    `email: ${existingUser.email}, id: ${existingUser.id}`
                );
                return this.acknowledge(message);
            } else if (existingUser && existingUser.userRole === UserRoles.ADMIN) {
                new UpdateEmployeePublisher(this.m_connection).publish({
                    ...employeeData,
                    userRole: UserRoles.ADMIN,
                    signInType: existingUser.signInType,
                    authId: existingUser.id,
                });
                this.m_logger.publish(
                    LogCodes.INFO,
                    `Employee is admin user`,
                    `CreateUserConsumer`,
                    `email: ${existingUser.email}, id: ${existingUser.id}`
                );
                return this.acknowledge(message);
            }

            const user = User.build({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                gender: employeeData.gender,
                race: employeeData.race,
                position: employeeData.position,
                startDate: employeeData.startDate,
                shiftPreference: employeeData.shiftPreference,
                branchName: employeeData.branchName,
                region: employeeData.region,
                country: employeeData.country,
                phoneNumber: employeeData.phoneNumber,
                registeredEmployee: employeeData.registeredEmployee,
                email: employeeData.email,
                signInType: employeeData.signInType,
                userRole: employeeData.userRole,
                password: employeeData.password,
                providerId: employeeData.providerId,
            });
            await user.save();

            new UpdateEmployeePublisher(this.m_connection).publish({
                ...employeeData,
                authId: user.id,
            });

            this.m_logger.publish(
                LogCodes.CREATED,
                `Employee saved as new user sign-in created`,
                `CreateUserConsumer`,
                `email: ${user.email}, id: ${user.id}`
            );

            return this.acknowledge(message);
        } catch (error) {
            this.m_logger.publish(LogCodes.ERROR, "Consumer Error", "CreateUserConsumer", `error: ${(error as Error).message}`);
            new UserSaveFailurePublisher(rabbitClient.connection).publish(employeeData);
            this.acknowledge(message);
        }
    }
}
