package events

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/queue/queueInfo"
	"github.com/streadway/amqp"
	"log"
)

type CreateEmployeeConsumer struct {
	queueName     queueInfo.QueueInfo
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
}

func NewCreateEmployeeConsumer(rabbitChannel *amqp.Channel) *CreateEmployeeConsumer {
	return &CreateEmployeeConsumer{queueName: queueInfo.CREATE_USER, exchangeName: exchangeNames.AUTH, exchangeType: exchangeTypes.DIRECT, rabbitChannel: rabbitChannel, consumerName: "create-employee"}
}

func (c *CreateEmployeeConsumer) Listen() {
	var err error
	// Declare exchange
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Declare queue
	queue, err := c.rabbitChannel.QueueDeclare(string(c.queueName), true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Bind queue
	err = c.rabbitChannel.QueueBind(string(c.queueName), string(c.queueName), string(c.exchangeName), false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Consume
	messages, err := c.rabbitChannel.Consume(queue.Name, "", true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("[consumer:%v]: Subscribed on queue:%v\n", c.consumerName, c.queueName)

	forever := make(chan bool)
	go func() {
		for d := range messages {
				log.Printf("%s",d.Body)
		}
	}()
	<-forever
}
