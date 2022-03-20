package consumers

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/bindkeys"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	localLogger "task-service/local-logger"
	"task-service/models"
	"task-service/services/mongoclient"
)

type DeleteEmployeeConsumer struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
	mongoClient   *mongoclient.MongoClient
}

func NewDeleteEmployeeConsumer(rabbitChannel *amqp.Channel, mongoClient *mongoclient.MongoClient) *DeleteEmployeeConsumer {
	return &DeleteEmployeeConsumer{bindKey: bindkeys.DELETE, exchangeName: exchangeNames.EMPLOYEE, exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, consumerName: "delete-employee"}
}

func (c *DeleteEmployeeConsumer) Listen() {
	var err error
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare exchange", "task/task-service/events/delete-employee-consumer.go:34")

	queue, err := c.rabbitChannel.QueueDeclare("", false, false, true, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare queue", "task/task-service/events/delete-employee-consumer.go:37")

	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to bind queue to exchange", "task/task-service/events/delete-employee-consumer.go:40")

	messages, err := c.rabbitChannel.Consume(queue.Name, "", true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to listen on queue", "task/task-service/events/delete-employee-consumer.go:43")

	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)
	forever := make(chan bool)
	go func() {
		for d := range messages {
			c.deleteEmployee(d.Body)
		}
	}()
	<-forever
}

func (c *DeleteEmployeeConsumer) deleteEmployee(data []byte) {
	var employeePayload models.Employee
	err := json.Unmarshal(data, &employeePayload)
	if err != nil {
		c.onFailure(err, logcodes.ERROR, "Failed to unmarshal json", "task/task-service/events/delete-employee-consumer.go:59")
	}
	employee := models.EmployeeItem{
		Id:          employeePayload.Id,
		Division:    employeePayload.Division,
		Email:       employeePayload.Email,
		NumberTasks: 0,
	}

	err = c.mongoClient.FindOneAndDeleteEmployee(context.TODO(), bson.D{{"email", employeePayload.Email}}, &employee)
	if err != nil {
		c.onFailure(err, logcodes.ERROR, "Delete employee failed", "task/task-service/events/delete-employee-consumer.go:70")
	}
}

func (c *DeleteEmployeeConsumer) onFailure(err error, errCode logcodes.LogCodes, message string, origin string) {
	if err != nil {
		localLogger.Log(errCode, message, origin, err.Error())
		panic(fmt.Sprintf("%v: %v", message, err.Error()))
	}
}
