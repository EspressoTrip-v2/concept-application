package publishers

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/bindkeys"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeNames"
	"github.com/EspressoTrip-v2/concept-go-common/exchange/exchangeTypes"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/streadway/amqp"
	localLogger "task-service/local-logger"
	"task-service/services/mongoclient"
)

var updateEmployeeRequeuePublisher *UpdateEmployeeRequeuePublisher

type UpdateEmployeeRequeuePublisher struct {
	bindKey       bindkeys.BindKey
	exchangeName  exchangeNames.ExchangeNames
	exchangeType  exchangeTypes.ExchangeType
	rabbitChannel *amqp.Channel
	publisherName string
	mongoClient   *mongoclient.MongoClient
}

func (p *UpdateEmployeeRequeuePublisher) Publish(body []byte) *libErrors.CustomError {
	err := p.rabbitChannel.Publish(string(p.exchangeName), string(p.bindKey), false, false, amqp.Publishing{
		ContentType: "text/plain",
		Body:        body,
	})
	ok := p.onFailure(err, logcodes.ERROR, "Failed to publish UpdateEmployeeRequeuePublisher message", "task/task-service/events/publishers/update-employee-requeue.go:31")
	if !ok {
		return libErrors.NewEventPublisherError("Publisher error")
	}
	return nil
}

func NewUpdateEmployeeRequeuePublisher(rabbitChannel *amqp.Channel, mongoClient *mongoclient.MongoClient) {
	if updateEmployeeRequeuePublisher == nil {
		updateEmployeeRequeuePublisher =
			&UpdateEmployeeRequeuePublisher{bindKey: bindkeys.TASK_EMP_UPDATE, exchangeName: exchangeNames.TASK,
				exchangeType: exchangeTypes.DIRECT, mongoClient: mongoClient, rabbitChannel: rabbitChannel, publisherName: "update-employee-requeue"}

	}

}

func GetUpdateEmployeeRequeuePublisher() *UpdateEmployeeRequeuePublisher {
	if updateEmployeeRequeuePublisher != nil {
		return updateEmployeeRequeuePublisher
	}
	return nil
}

func (p *UpdateEmployeeRequeuePublisher) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		fmt.Printf("[publisher:%v]: Publish error: %v | %v\n", &p.publisherName, p.exchangeName, p.bindKey)
		return false
	}
	return true
}

func (p *UpdateEmployeeRequeuePublisher) onSuccess(logCode logcodes.LogCodes, message string, origin string, detail string) {
	localLogger.Log(logCode, message, origin, detail)
}
