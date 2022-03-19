package events

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/bindkeys"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/streadway/amqp"
	"log"
)

type CreateEmployeeConsumer struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
}

func NewCreateEmployeeConsumer(rabbitChannel *amqp.Channel) *CreateEmployeeConsumer {
	return &CreateEmployeeConsumer{bindKey: bindkeys.CREATE, exchangeName: exchangeNames.AUTH, exchangeType: exchangeTypes.DIRECT, rabbitChannel: rabbitChannel, consumerName: "create-employee"}
}

func (c *CreateEmployeeConsumer) Listen() {
	var err error
	// Declare exchange
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Declare queue
	queue, err := c.rabbitChannel.QueueDeclare("", true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Bind queue
	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Consume
	messages, err := c.rabbitChannel.Consume(queue.Name, "", true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)

	forever := make(chan bool)
	go func() {
		for d := range messages {
			log.Printf("%s", d.Body)
		}
	}()
	<-forever
}
