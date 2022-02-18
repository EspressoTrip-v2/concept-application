import { AbstractConsumer, CreateEmployeeEvent, EmployeeMsg, ExchangeNames, ExchangeTypes, QueueInfo, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

export class CreateEmployeeSigninConsumer extends AbstractConsumer<CreateEmployeeEvent>{
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.CREATE_EMPLOYEE = QueueInfo.CREATE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "create-employee");
    }

    async onMessage(data: CreateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingEmployee = await User.find({email: data.email, userRole: data.userRole});
        if(existingEmployee) throw new Error('CreateEmployeeSignIn: Employee sign-in already exists.');


        this.acknowledge(message);
    }

}
