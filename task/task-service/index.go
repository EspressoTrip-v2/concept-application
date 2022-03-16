package main

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"os"
	localLogger "task-service/local-logger"
	"task-service/services/grpc"
	"task-service/services/mongoclient"
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
	// RabbitMQ
	rabbit, err := rabbitmq.StartRabbitClient(os.Getenv("RABBIT_URI"), "task-api")

	// Logger
	localLogger.Start(rabbit, microserviceNames.TASK_SERVICE)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "RabbitMQ connection failed", "task/task-service/index.go:32", err.Message)
	}

	// MongoDB
	mClient, err := mongoclient.GetMongoDB()
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB error", "task/task-service/index.go:32", err.Message)
	}
	defer mClient.Disconnect()

	// gRPC Server
	err = grpc.NewGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.TASK_SERVICE, mClient).
		Listen(fmt.Sprintf("[task-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC server failed", "task/task-service/index.go:56", err.Message)
	}

}
