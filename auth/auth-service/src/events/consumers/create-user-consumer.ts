import { AbstractConsumer, BindKey, CreateUserEvent, ExchangeNames, ExchangeTypes, LogCodes, PersonMsg } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";
import { UpdateEmployeePublisher, UserSaveFailurePublisher } from "../publishers";
import { LocalLogger } from "../../utils";

export class CreateUserConsumer extends AbstractConsumer<CreateUserEvent> {
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.CREATE = BindKey.CREATE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "create-user");
    }

    async onMessage(data: CreateUserEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const employeeData: PersonMsg = JSON.parse(data.toString());
        try {
            const existingUser = await User.findOne({ email: employeeData.email });
            if (existingUser) {
                LocalLogger.log(
                    LogCodes.ERROR,
                    `Employee sign-in already exists`,
                    `auth/auth-service/src/events/consumers/create-user-consumer.ts:21`,
                    `email: ${existingUser.email}, UserId: ${existingUser.id}, employeeId: ${employeeData.id}`
                );
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
                registeredEmployee: employeeData.registeredEmployee,
                email: employeeData.email,
                signInType: employeeData.signInType!,
                userRole: employeeData.userRole,
                password: employeeData.password,
                providerId: employeeData.providerId,
            });
            await user.save();

            UpdateEmployeePublisher.updateEmployeePublisher().publish({
                ...employeeData,
                authId: user.id,
            });
            LocalLogger.log(
                LogCodes.CREATED,
                `Employee saved as new user sign-in created`,
                `auth/auth-service/src/events/consumers/create-user-consumer.ts:75`,
                `email: ${user.email}, UserId: ${user.id}, employeeId: ${employeeData.id}`
            );
        } catch (error) {
            LocalLogger.log(
                LogCodes.ERROR,
                "Consumer Error",
                "auth/auth-service/src/events/consumers/create-user-consumer.ts:81",
                `error: ${(error as Error).message}`
            );
            UserSaveFailurePublisher.userFailurePublisher().publish(employeeData);
        }
    }
}
