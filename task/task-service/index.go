package main

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"os"
	localLogger "task-service/local-logger"
	"task-service/services"
)

func envCheck() {
	if os.Getenv("RABBIT_URI") == "" {
		log.Fatalln("RABBIT_URI must be defined")
	}
	if os.Getenv("GRPC_SERVER_PORT") == "" {
		log.Fatalln("GRPC_SERVER_PORT must be defined")
	}
}

func main() {
	envCheck()
	// start rabbit connection
	_, err := rabbitmq.StartRabbitClient(os.Getenv("RABBIT_URI"), "task-api")
	if err != nil {
		localLogger.Log(logcodes.ERROR, "RabbitMQ connection failed", "task-service/index.go:23", err.Message)
	}

	// start grpc server
	err = services.NewGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.TASK_SERVICE).
		Listen(fmt.Sprintf("[task-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC server failed", "task-service/index.go:31", err.Message)
	}
}
