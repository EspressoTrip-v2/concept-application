import { AbstractConsumer, BindKey, CreateUserEvent, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";
import { UpdateEmployeePublisher, UserSaveFailurePublisher } from "../publishers";
import { LocalLogger } from "../../utils";

export class CreateUserConsumer extends AbstractConsumer<CreateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.AUTH_CREATE = BindKey.AUTH_CREATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "create-user");
    }

    nackMessage(message: amqp.ConsumeMessage): void {
        this.m_channel.ack(message);
    }

    async onMessage(data: CreateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (existingUser) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    `Employee sign-in already exists`,
                    `auth/auth-service/src/events/consumers/create-user-consumer.ts:25`,
                    `email: ${existingUser.email}, UserId: ${existingUser.id}, employeeId: ${employeeData.id}`
                );
                this.nackMessage(message)
                return;
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
                division: employeeData.division,
                registeredEmployee: employeeData.registeredEmployee,
                email: employeeData.email,
                signInType: employeeData.signInType!,
                userRole: employeeData.userRole,
                password: employeeData.password,
                providerId: employeeData.providerId,
            });
            await user.save();
            delete employeeData.version // Remove the versioning so there are no clashes
            UpdateEmployeePublisher.updateEmployeePublisher().publish({
                ...employeeData,
                authId: user.id,
            });
            LocalLogger.log(
                LogCodes.CREATED,
                `Employee saved as new user sign-in created`,
                `auth/auth-service/src/events/consumers/create-user-consumer.ts:61`,
                `email: ${user.email}, UserId: ${user.id}, employeeId: ${employeeData.id}`
            );
            // Acknowledge message
            this.nackMessage(message);
        } catch (error) {
            LocalLogger.log(
                LogCodes.ERROR,
                "Consumer Error",
                "auth/auth-service/src/events/consumers/create-user-consumer.ts:70",
                `error: ${(error as Error).message}`
            );
            UserSaveFailurePublisher.userFailurePublisher().publish(employeeData);
        }
    }
}
