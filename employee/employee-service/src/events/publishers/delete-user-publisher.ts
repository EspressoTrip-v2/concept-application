import { AbstractPublisher, BindKey, DeleteUserEvent, ExchangeNames, ExchangeTypes, LogCodes } from "@espressotrip-org/concept-common";
import amqp from "amqplib";
import { LocalLogger } from "../../utils";

export class DeleteUserPublisher extends AbstractPublisher<DeleteUserEvent> {
    static m_instance: DeleteUserPublisher
    m_exchangeName: ExchangeNames.AUTH = ExchangeNames.AUTH;
    m_exchangeType: ExchangeTypes.DIRECT = ExchangeTypes.DIRECT;
    m_bindKey: BindKey.DELETE = BindKey.DELETE;

    constructor(rabbitChannel: amqp.Channel) {
        super(rabbitChannel, "delete-user");
    }

    static NewDeleteUserPublisher(rabbitChannel: amqp.Channel) {
        this.m_instance = new DeleteUserPublisher(rabbitChannel);
    }

    static deleteUserPublisher(): DeleteUserPublisher {
        if(!this.m_instance) {
            LocalLogger.log(
                LogCodes.ERROR,
                `DeleteUserPublisher not created`,
                `employee/employee-service/src/events/publishers/delete-user-publisher.ts:22`,
                "DeleteUserPublisher not created in application index.ts"
            );
            throw new Error("DeleteUserPublisher not created in application index.ts")
        }
        return this.m_instance;
    }

    async publish(data: DeleteUserEvent["data"]): Promise<void> {
        await this._publish(data);
    }
}
