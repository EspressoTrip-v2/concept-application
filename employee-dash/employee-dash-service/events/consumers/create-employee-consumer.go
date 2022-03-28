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
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
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
	return &CreateEmployeeConsumer{bindKey: bindkeys.AUTH_CREATE, exchangeName: exchangeNames.AUTH, exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, consumerName: "create-employee"}
}

func (c *CreateEmployeeConsumer) Listen() {
	var err error
	err = c.rabbitChannel.ExchangeDeclare(string(c.exchangeName), string(c.exchangeType), true, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare exchange", "task/employee-dash-service/events/create-employee-consumer.go:34")

	queue, err := c.rabbitChannel.QueueDeclare("", false, false, true, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to declare queue", "task/employee-dash-service/events/create-employee-consumer.go:37")

	err = c.rabbitChannel.QueueBind(queue.Name, string(c.bindKey), string(c.exchangeName), false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to bind queue to exchange", "task/employee-dash-service/events/create-employee-consumer.go:40")

	messages, err := c.rabbitChannel.Consume(queue.Name, "", false, false, false, false, nil)
	c.onFailure(err, logcodes.ERROR, "Failure to listen on queue", "task/employee-dash-service/events/create-employee-consumer.go:43")

	fmt.Printf("[consumer:%v]: Subscribed on exchange:%v | route:%v\n", c.consumerName, c.exchangeName, c.bindKey)
	forever := make(chan bool)
	go func() {
		for d := range messages {
			ok := c.createEmployee(d.Body)
			if !ok {
				localLogger.Log(logcodes.ERROR, "go routine error", "task/employee-dash-service/events/create-employee-consumer.go:51", "Error creating employee")
				continue
			}
			err := d.Ack(false)
			if err != nil {
				localLogger.Log(logcodes.ERROR, "go routine message acknowledge error", "task/employee-dash-service/events/create-employee-consumer.go:56",
					fmt.Sprintf("Error acknowkledging message: %v", string(d.Body)))
			}

		}
	}()
	<-forever
}

func (c *CreateEmployeeConsumer) createEmployee(data []byte) bool {
	var employeePayload models.EmployeePayload
	err := json.Unmarshal(data, &employeePayload)
	ok := c.onFailure(err, logcodes.ERROR, "Failed to unmarshal json", "task/employee-dash-service/events/create-employee-consumer.go:68")
	if !ok {
		return ok
	}
	oid, err := primitive.ObjectIDFromHex(employeePayload.Id)
	ok = c.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/employee-dash-service/events/create-employee-consumer.go:73")
	if !ok {
		return ok
	}
	employee := models.Employee{
		Id:                 oid,
		Country:            employeePayload.Country,
		Email:              employeePayload.Email,
		Gender:             employeePayload.Gender,
		BranchName:         employeePayload.BranchName,
		LastName:           employeePayload.LastName,
		Password:           employeePayload.Password,
		Race:               employeePayload.Race,
		Region:             employeePayload.Region,
		RegisteredEmployee: false,
		Position:           employeePayload.Position,
		ProviderId:         employeePayload.ProviderId,
		ShiftPreference:    employeePayload.ShiftPreference,
		StartDate:          time.Time{},
		SignInType:         employeePayload.SignInType,
		UserRole:           employeePayload.UserRole,
		FirstName:          employeePayload.FirstName,
		PhoneNumber:        employeePayload.PhoneNumber,
		Division:           employeePayload.Division,
		Version:            employeePayload.Version,
	}
	_, err = c.mongoClient.InsertEmployee(context.TODO(), &employee)
	ok = c.onFailure(err, logcodes.ERROR, "Insert employee failed", "task/employee-dash-service/events/create-employee-consumer.go:95")
	if !ok {
		return ok
	}
	c.onSuccess(logcodes.CREATED, "Employee created", "task/employee-dash-service/events/create-employee-consumer.go:95", "Employee view created")
	return true
}

func (c *CreateEmployeeConsumer) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		fmt.Printf("[employee-dash-service:consumer]: CreateEmployeeConsumer error -> %v", err.Error())
		return false
	}
	return true
}

func (c *CreateEmployeeConsumer) onSuccess(logCode logcodes.LogCodes, message string, origin string, detail string) {
	localLogger.Log(logCode, message, origin, detail)
}
