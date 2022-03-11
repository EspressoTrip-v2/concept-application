package main

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/logging"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"os"
)

func Start() {
	rabbit, err := rabbitmq.NewRabbitClient(os.Getenv("RABBIT_URI"), "task-api").Connect()
	if err != nil {
		fmt.Println(err.Message)
	}
	logging.NewLogPublish(rabbit, microserviceNames.TASK_API).Log(logcodes.CREATED, "App start up", "task-api", "test message")

	// This is temporary to keep the container running
	message := make(chan bool)
	<-message

}
