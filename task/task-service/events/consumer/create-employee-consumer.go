package consumer

import (
	"github.com/EspressoTrip-v2/concept-go-common/events"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/queue/queueInfo"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/streadway/amqp"
)

type CreateEmployeeConsumer struct {
	consumer *events.EventConsumer
}

func NewCreateEmployeeConsumer(rabbitConnection *amqp.Connection) *CreateEmployeeConsumer {
	consumer := events.NewEventConsumer(rabbitConnection, exchangeNames.EMPLOYEE, exchangeTypes.DIRECT,
		queueInfo.CREATE_EMPLOYEE, "create-employee", microserviceNames.TASK_SERVICE)
	return &CreateEmployeeConsumer{consumer: consumer}
}

func (c CreateEmployeeConsumer) Listen() {
	c.consumer.Listen("")
}
