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
	mongo "task-service/services/mongo"
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
	_, err := rabbitmq.StartRabbitClient(os.Getenv("RABBIT_URI"), "task-api")
	if err != nil {
		localLogger.Log(logcodes.ERROR, "RabbitMQ connection failed", "task-service/index.go:32", err.Message)
	}

	// MongoDB
	mongoClient := mongo.GetMongoClient()
	mongoClient.AddCollections("task", "task")
	err = mongoClient.Connect()
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Failed to connect to MongoDB", "task-service/index.go:240", "Failed to connect to the Mongo database")
	}

	// gRPC Server
	err = grpc.NewGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.TASK_SERVICE).
		Listen(fmt.Sprintf("[task-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC server failed", "task-service/index.go:31", err.Message)
	}
}
