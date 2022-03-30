package consumers

import (
	"context"
	"employee-dash-service/events/publishers"
	localLogger "employee-dash-service/local-logger"
	"employee-dash-service/models"
	"employee-dash-service/services/mongoclient"
	"employee-dash-service/utils"
	"encoding/json"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/bindkeys"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// UpdateEmployeeEmpConsumer updates the employee item from the employee service
type UpdateEmployeeEmpConsumer struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	consumerName  string
	mongoClient   *mongoclient.MongoClient
}

func NewUpdateEmployeeEmpConsumer(rabbitChannel *amqp.Channel, mongoClient *mongoclient.MongoClient) *UpdateEmployeeEmpConsumer {
	return &UpdateEmployeeEmpConsumer{bindKey: bindkeys.TASK_EMP_UPDATE, exchangeName: exchangeNames.TASK, exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, consumerName: "update-employee"}
}

func (c *UpdateEmployeeEmpConsumer) Listen() {
	var err error
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare exchange", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:38")

	queue, err := c.rabbitChannel.QueueDeclare("", false, false, true, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare queue", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:41")

	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to bind queue to exchange", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:44")

	messages, err := c.rabbitChannel.Consume(queue.Name, "", false, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to listen on queue", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:47")

	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)
	forever := make(chan bool)
	go func() {
		for d := range messages {
			ok := c.updateEmployee(d.Body)
			if !ok {
				localLogger.Log(logcodes.ERROR, "go routine error", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:55", "Error updating employee")
				err := d.Ack(false)
				if err != nil {
					localLogger.Log(logcodes.ERROR, "go routine message acknowledge error", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:58",
						fmt.Sprintf("Error acknowkledging message: %v", string(d.Body)))
				}
				continue
			}
			err := d.Ack(false)
			if err != nil {
				localLogger.Log(logcodes.ERROR, "go routine message acknowledge error", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:65",
					fmt.Sprintf("Error acknowkledging message: %v", string(d.Body)))
			}
		}
	}()
	<-forever
}

func (c *UpdateEmployeeEmpConsumer) updateEmployee(data []byte) bool {
	var employeePayload models.EmployeePayload
	err := json.Unmarshal(data, &employeePayload)
	ok := c.onFailure(err, logcodes.ERROR, "Failed to unmarshal json", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:76")
	if !ok {
		return ok
	}

	hashedPassword, err := utils.HashPassword(employeePayload.Password, 8)
	ok = c.onFailure(err, logcodes.ERROR, "Password hashing failure", "employee-dash/employee-dash-service/events/update-employee-consumer.go:82")
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
		{"startDate", employeePayload.StartDate},
		{"shiftPreference", employeePayload.ShiftPreference},
		{"gender", employeePayload.Gender},
		{"race", employeePayload.Race},
		{"signInType", employeePayload.SignInType},
		{"phoneNumber", employeePayload.PhoneNumber},
		{"providerId", employeePayload.ProviderId},
		{"userRole", employeePayload.UserRole},
		{"region", employeePayload.Region},
		{"password", hashedPassword},
		{"version", employeePayload.Version},
	}}}

	err = c.mongoClient.FindOneAndUpdateEmployee(context.TODO(), filter, &employee, update, nil)
	if err == mongo.ErrNoDocuments {
		publishers.GetUpdateEmployeeRequeuePublisher().Publish(data)
		return true
	}
	ok = c.onFailure(err, logcodes.ERROR, "Update employee failed", "employee-dash/employee-dash-service/events/update-employee-emp-consumer.go:114")
	if !ok {
		return ok
	}
	return true
}

func (c *UpdateEmployeeEmpConsumer) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		fmt.Printf("[employee-dash-service:consumer]: UpdateEmployeeEmpConsumer error -> %v\n", err.Error())
		return false
	}
	return true
}

func (c *UpdateEmployeeEmpConsumer) onSuccess(logCode logcodes.LogCodes, message string, origin string, detail string) {
	localLogger.Log(logCode, message, origin, detail)
}
