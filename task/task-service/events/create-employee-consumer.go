package events

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/bindkeys"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/streadway/amqp"
	localLogger "task-service/local-logger"
	"task-service/models"
	"task-service/services/mongoclient"
)

type CreateEmployeeConsumer struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
	mongoClient   *mongoclient.MongoClient
}

func NewCreateEmployeeConsumer(rabbitChannel *amqp.Channel, mongoClient *mongoclient.MongoClient) *CreateEmployeeConsumer {
	return &CreateEmployeeConsumer{bindKey: bindkeys.CREATE, exchangeName: exchangeNames.AUTH, exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, consumerName: "create-employee"}
}

func (c *CreateEmployeeConsumer) Listen() {
	var err error
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare exchange", "task/task-service/events/create-employee-consumer.go:30")

	queue, err := c.rabbitChannel.QueueDeclare("", false, false, true, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare queue", "task/task-service/events/create-employee-consumer.go:33")

	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to bind queue to exchange", "task/task-service/events/create-employee-consumer.go:36")

	messages, err := c.rabbitChannel.Consume(queue.Name, "", true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to listen on queue", "task/task-service/events/create-employee-consumer.go:39")

	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)
	forever := make(chan bool)
	go func() {
		for d := range messages {
			c.createEmployee(d.Body)
		}
	}()
	<-forever
}

func (c *CreateEmployeeConsumer) createEmployee(data []byte) {
	var employeePayload models.Employee
	err := json.Unmarshal(data, &employeePayload)
	if err != nil {
		c.onFailure(err, logcodes.ERROR, "Failed to unmarshal json", "task/task-service/events/create-employee-consumer.go:55")
	}

	employee := models.EmployeeItem{
		Id:          employeePayload.Id,
		Division:    employeePayload.Division,
		Email:       employeePayload.Email,
		NumberTasks: 0,
	}
	_, err = c.mongoClient.InsertEmployee(context.TODO(), &employee)
	if err != nil {
		c.onFailure(err, logcodes.ERROR, "Insert employee failed", "task/task-service/events/create-employee-consumer.go:69")
	}
}

func (c *CreateEmployeeConsumer) onFailure(err error, errCode logcodes.LogCodes, message string, origin string) {
	if err != nil {
		localLogger.Log(errCode, message, origin, err.Error())
		panic(fmt.Sprintf("%v: %v", message, err.Error()))
	}
}
