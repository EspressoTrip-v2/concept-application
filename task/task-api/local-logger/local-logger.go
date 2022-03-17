package localLogger

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/logging"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/streadway/amqp"
)

var localLogger *localLoggerConfig

type localLoggerConfig struct {
	serviceName microserviceNames.MicroserviceNames
	logger      *logging.LogPublish
}

func Start(rabbitConnection *amqp.Connection, serviceName microserviceNames.MicroserviceNames) {
	if localLogger == nil {
		logger := localLoggerConfig{
			serviceName: serviceName,
			logger:      logging.NewLogPublish(rabbitConnection, serviceName),
		}
		localLogger = &logger
	}
}

func Log(errCode logcodes.LogCodes, message string, origin string, details string) {
	if localLogger == nil {
		fmt.Printf("[logger:%v]: Has not been started, logs will not be sent", localLogger.serviceName)
	} else {
		localLogger.logger.Log(errCode, message, origin, details)
	}
}
