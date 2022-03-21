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

type UpdateEmployeeConsumer struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
	mongoClient   *mongoclient.MongoClient
}

func NewUpdateEmployeeConsumer(rabbitChannel *amqp.Channel, mongoClient *mongoclient.MongoClient) *UpdateEmployeeConsumer {
	return &UpdateEmployeeConsumer{bindKey: bindkeys.UPDATE, exchangeName: exchangeNames.AUTH, exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, consumerName: "update-employee"}
}

func (c *UpdateEmployeeConsumer) Listen() {
	var err error
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare exchange", "task/task-service/events/update-employee-consumer.go:34")

	queue, err := c.rabbitChannel.QueueDeclare("", false, false, true, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare queue", "task/task-service/events/update-employee-consumer.go:37")

	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to bind queue to exchange", "task/task-service/events/update-employee-consumer.go:40")

	messages, err := c.rabbitChannel.Consume(queue.Name, "", false, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to listen on queue", "task/task-service/events/update-employee-consumer.go:43")

	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)
	forever := make(chan bool)
	go func() {
		for d := range messages {
			ok := c.updateEmployee(d.Body)
			if !ok {
				localLogger.Log(logcodes.ERROR, "go routine error", "task/task-service/events/update-employee-consumer.go:51", "Error updating employee")
				continue
			}
			err := d.Ack(false)
			if err != nil {
				localLogger.Log(logcodes.ERROR, "go routine message acknowledge error", "task/task-service/events/create-employee-consumer.go:56",
					fmt.Sprintf("Error acknowkledging message: %v", string(d.Body)))
			}
		}
	}()
	<-forever
}

func (c *UpdateEmployeeConsumer) updateEmployee(data []byte) bool {
	var employeePayload models.EmployeePayload
	err := json.Unmarshal(data, &employeePayload)

	ok := c.onFailure(err, logcodes.ERROR, "Failed to unmarshal json", "task/task-service/events/update-employee-consumer.go:62")
	if !ok {
		return ok
	}

	var employee models.Employee
	filter := bson.D{{"email", employeePayload.Email}, {"version", employeePayload.Version - 1}}
	update := bson.D{{"$set", bson.D{
		{"email", employeePayload.Email},
		{"division", employeePayload.Division},
		{"branchName", employeePayload.BranchName},
		{"firstName", employeePayload.FirstName},
		{"lastName", employeePayload.LastName},
		{"position", employeePayload.Position},
		{"country", employeePayload.Country},
		{"shiftPreference", employeePayload.ShiftPreference},
		{"version", employeePayload.Version},
	}}}

	err = c.mongoClient.FindOneAndUpdateEmployee(context.TODO(), filter, &employee, update, nil)
	ok = c.onFailure(err, logcodes.ERROR, "Update employee failed", "task/task-service/events/update-employee-consumer.go:81")
	if !ok {
		return ok
	}
	return true
}

func (c *UpdateEmployeeConsumer) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		return false
	}
	return true
}

func (c *UpdateEmployeeConsumer) onSuccess(logCode logcodes.LogCodes, message string, origin string, detail string) {
	localLogger.Log(logCode, message, origin, detail)
}
