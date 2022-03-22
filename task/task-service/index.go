package main

import (
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"os"
	"task-service/events/consumers"
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
	var mClient *mongoclient.MongoClient
	rabbit, err := rabbitmq.GetRabbitClient(os.Getenv("RABBIT_URI"), "task-service")
	if err != nil {
		log.Fatalln("[task-service:rabbitmq:]: Failed to connect to RabbitMQ message bus")
	}

	// Logging
	logChannel, err := rabbit.AddChannel("log")
	ok := onFailure(err, logcodes.ERROR, "", "ask/task-service/index.go:40")
	if ok == true {
		localLogger.Start(logChannel, microserviceNames.TASK_SERVICE)
	}

	// MongoDB
	mClient, err = mongoclient.GetMongoDB()
	onFailure(err, logcodes.ERROR, "MongoDB error", "task/task-service/index.go:47")
	defer mClient.Disconnect()

	// Consumers
	cecChannel, err := rabbit.AddChannel("cec")
	ok = onFailure(err, logcodes.ERROR, "", "ask/task-service/index.go:52")
	if ok == true {
		go consumers.NewCreateEmployeeConsumer(cecChannel, mClient).Listen()
	}

	decChannel, err := rabbit.AddChannel("dec")
	ok = onFailure(err, logcodes.ERROR, "", "ask/task-service/index.go:58")
	if ok == true {
		go consumers.NewDeleteEmployeeConsumer(decChannel, mClient).Listen()
	}

	usfChannel, err := rabbit.AddChannel("usf")
	ok = onFailure(err, logcodes.ERROR, "", "ask/task-service/index.go:64")
	if ok == true {
		go consumers.NewUserSaveFailureConsumer(usfChannel, mClient).Listen()
	}

	ueecChannel, err := rabbit.AddChannel("ueec")
	ok = onFailure(err, logcodes.ERROR, "", "ask/task-service/index.go:64")
	if ok == true {
		go consumers.NewUpdateEmployeeEmpConsumer(ueecChannel, mClient).Listen()
	}

	// gRPC Server
	err = grpc.NewGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.TASK_SERVICE, mClient).
		Listen(fmt.Sprintf("[task-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	ok = onFailure(err, logcodes.ERROR, "gRPC server failed", "task/task-service/index.go:72")
	if ok != true {
		log.Fatalln("[task-service:gRPC-server]: Failed to connect to gRPC server")
	}

}

func onFailure(err *libErrors.CustomError, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Message[0])
		log.Printf("[task-service:error]: Service start up error -> %v", message)
		return false
	}
	return true
}
