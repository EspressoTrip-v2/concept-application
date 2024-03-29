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

func Start(rabbitChannel *amqp.Channel, serviceName microserviceNames.MicroserviceNames) {
	if localLogger == nil {
		logger := localLoggerConfig{
			serviceName: serviceName,
			logger:      logging.NewLogPublish(rabbitChannel, serviceName),
		}
		localLogger = &logger
	}
}

func Log(logCode logcodes.LogCodes, message string, origin string, details string) {
	if localLogger == nil {
		fmt.Printf("[logger:%v]: Has not been started, logs will not be sent", localLogger.serviceName)
	} else {
		localLogger.logger.Log(logCode, message, origin, details)
	}
}
