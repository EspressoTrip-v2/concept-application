package main

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"log"
	"os"
	"task-service/events"
	localLogger "task-service/local-logger"
	"task-service/services/grpc"
	"task-service/services/mongoclient"
	"task-service/services/rabbitmq"
)

func envCheck() {
	if os.Getenv("RABBIT_URI") == "" {
		log.Fatalln("RABBIT_URI must be defined")
	}
	if os.Getenv("GRPC_SERVER_PORT") == "" {
		log.Fatalln("GRPC_SERVER_PORT must be defined")
	}
	if os.Getenv("MONGO_URI") == "" {
		log.Fatalln("MONGO_URI must be defined")
	}
}

func main() {
	envCheck()
	var mClient *mongoclient.MongoClient
	// RabbitMQ
	rabbit, err := rabbitmq.GetRabbitClient(os.Getenv("RABBIT_URI"), "task-service")
	if err != nil {
		log.Fatalln("[rabbitmq:task-service]: Failed to connect to RabbitMQ message bus")
	}

	// Logging
	if logChannel, err := rabbit.AddChannel("log"); err != nil {
		log.Println("[rabbitmq:task-service]: Failed to create channel for logging")
	} else {
		localLogger.Start(logChannel, microserviceNames.TASK_SERVICE)
	}

	// MongoDB
	if mClient, err := mongoclient.GetMongoDB(); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB error", "task/task-service/index.go:32", err.Message)
	} else {
		defer mClient.Disconnect()
	}

	// Consumers
	if cecChannel, err := rabbit.AddChannel("cec"); err != nil {
		log.Println("[rabbitmq:task-service]: Failed to create channel for employee-create-consumer")
	} else {
		go events.NewCreateEmployeeConsumer(cecChannel).Listen()
	}

	// gRPC Server
	err = grpc.NewGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.TASK_SERVICE, mClient).
		Listen(fmt.Sprintf("[task-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC server failed", "task/task-service/index.go:56", err.Message)
	}

}
