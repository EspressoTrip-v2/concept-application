import { AbstractConsumer,  ExchangeNames, ExchangeTypes, QueueInfo, UpdateEmployeeEvent } from "@espressotrip-org/concept-common";
import * as amqp from "amqplib";
import { User } from "../../models";

export class UpdateEmployeeSigninConsumer extends AbstractConsumer<UpdateEmployeeEvent>{
    m_exchangeName: ExchangeNames.EMPLOYEE = ExchangeNames.EMPLOYEE;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_queue: QueueInfo.UPDATE_EMPLOYEE = QueueInfo.UPDATE_EMPLOYEE;

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection, "update-employee");
    }

    async onMessage(data: UpdateEmployeeEvent["data"], message: amqp.ConsumeMessage): Promise<void> {
        const existingUser = await User.find({email: data.email, userRole: data.userRole});
        if(!existingUser) throw new Error('UpdateEmployeeConsumer: User not found.');


        this.acknowledge(message);
    }

}
