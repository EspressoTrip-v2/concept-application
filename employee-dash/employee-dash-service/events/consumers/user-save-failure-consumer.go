package consumers

import (
	"context"
	localLogger "employee-dash-service/local-logger"
	"employee-dash-service/models"
	"employee-dash-service/services/mongoclient"
	"encoding/json"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/bindkeys"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
)

type UserSaveFailureConsumer struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
	mongoClient   *mongoclient.MongoClient
}

func NewUserSaveFailureConsumer(rabbitChannel *amqp.Channel, mongoClient *mongoclient.MongoClient) *UserSaveFailureConsumer {
	return &UserSaveFailureConsumer{bindKey: bindkeys.AUTH_ERROR, exchangeName: exchangeNames.AUTH, exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, consumerName: "delete-employee"}
}

func (c *UserSaveFailureConsumer) Listen() {
	var err error
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare exchange", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:34")

	queue, err := c.rabbitChannel.QueueDeclare("", false, false, true, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare queue", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:37")

	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to bind queue to exchange", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:40")

	messages, err := c.rabbitChannel.Consume(queue.Name, "", false, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to listen on queue", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:43")

	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)
	forever := make(chan bool)
	go func() {
		for d := range messages {
			ok := c.deleteEmployee(d.Body)
			if !ok {
				localLogger.Log(logcodes.ERROR, "go routine error", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:51", "Error deleting employee")
				// Acknowledge message if employee does not exist as its already been deleted
				err := d.Ack(false)
				if err != nil {
					localLogger.Log(logcodes.ERROR, "go routine message acknowledge error", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:55",
						fmt.Sprintf("Error acknowkledging message: %v", string(d.Body)))
				}
				continue
			}
			err := d.Ack(false)
			if err != nil {
				localLogger.Log(logcodes.ERROR, "go routine message acknowledge error", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:62",
					fmt.Sprintf("Error acknowkledging message: %v", string(d.Body)))
			}
		}
	}()
	<-forever
}

func (c *UserSaveFailureConsumer) deleteEmployee(data []byte) bool {
	var employeePayload models.EmployeePayload
	err := json.Unmarshal(data, &employeePayload)
	ok := c.onFailure(err, logcodes.ERROR, "Failed to unmarshal json", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:73")
	if !ok {
		return ok
	}
	var employee models.Employee
	err = c.mongoClient.FindOneAndDeleteEmployee(context.TODO(), bson.D{{"email", employeePayload.Email}}, &employee)
	ok = c.onFailure(err, logcodes.ERROR, "Delete employee failed", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:79")
	if !ok {
		return ok
	}
	c.onSuccess(logcodes.DELETED, "Employee deleted", "employee-dash/employee-dash-service/events/user-save-failure-consumer.go:83",
		fmt.Sprintf("email: %v, employeeId: %v", employeePayload.Email, employeePayload.Id))
	return true
}

func (c *UserSaveFailureConsumer) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		fmt.Printf("[employee-dash-service:consumer]: UserSaveFailureConsumer error -> %v", err.Error())
		return false
	}
	return true
}

func (c *UserSaveFailureConsumer) onSuccess(logCode logcodes.LogCodes, message string, origin string, detail string) {
	localLogger.Log(logCode, message, origin, detail)
}
