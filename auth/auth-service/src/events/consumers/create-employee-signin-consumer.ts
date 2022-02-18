import {
    AbstractConsumer,
    CreateEmployeeEvent,
    ExchangeNames,
    ExchangeTypes,
    QueueInfo,
    SignInTypes,
    UpdateEmployeeEvent,
    UserRoles,
} from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User, UserAttrs } from "../../models";

export class CreateEmployeeSigninConsumer extends AbstractConsumer<CreateEmployeeEvent> {
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_EMPLOYEE = QueueInfo.CREATE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-employee");
    }

    async onMessage(data: CreateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingEmployee = await User.findOne({ email: data.email, userRole: data.userRole });
        if (existingEmployee) throw new Error("CreateEmployeeSignIn: Employee sign-in already exists.");

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
        this.acknowledge(message);
    }
}
