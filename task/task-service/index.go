package main

import (
	"context"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"os"
	"task-service/events/consumers"
	"task-service/events/publishers"
	localLogger "task-service/local-logger"
	"task-service/services/grpc"
	"task-service/services/mongoclient"
	"task-service/tracer"
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

	// Tracer
	traceProvider, err := tracer.NewTraceProvider("jaeger")
	ok := onFailure(err, logcodes.ERROR, "Open-telemetry error", "task/task-service/index.go:36")
	if ok {
		defer func() {
			err := traceProvider.Shutdown(context.Background())
			if err != nil {
				onFailure(libErrors.NewBadRequestError(err.Error()), logcodes.ERROR, "Trace provider shutdown error", "task/task-service/index.go:42")
			}
		}()
	}

	// RabbitMQ
	var mClient *mongoclient.MongoClient
	rabbit, err := rabbitmq.GetRabbitClient(os.Getenv("RABBIT_URI"), "task-service")
	if err != nil {
		log.Fatalln("[task-service:rabbitmq:]: Failed to connect to RabbitMQ message bus")
	}

	// Logging
	logChannel, err := rabbit.AddChannel("log")
	ok = onFailure(err, logcodes.ERROR, "", "ask/task-service/index.go:56")
	if ok {
		localLogger.Start(logChannel, microserviceNames.TASK_SERVICE)
	}

	// MongoDB
	mClient, err = mongoclient.GetMongoDB()
	onFailure(err, logcodes.ERROR, "MongoDB error", "task/task-service/index.go:63")
	defer mClient.Disconnect()

	// Rabbit Consumers
	cecChannel, err := rabbit.AddChannel("cec")
	ok = onFailure(err, logcodes.ERROR, "Failed to create CreateEmployeeConsumer channel", "ask/task-service/index.go:68")
	if ok {
		go consumers.NewCreateEmployeeConsumer(cecChannel, mClient).Listen()
	}

	decChannel, err := rabbit.AddChannel("dec")
	ok = onFailure(err, logcodes.ERROR, "Failed to create DeleteEmployeeConsumer channel", "ask/task-service/index.go:74")
	if ok {
		go consumers.NewDeleteEmployeeConsumer(decChannel, mClient).Listen()
	}

	usfChannel, err := rabbit.AddChannel("usf")
	ok = onFailure(err, logcodes.ERROR, "Failed to create UserSaveFailureConsumer channel", "ask/task-service/index.go:80")
	if ok {
		go consumers.NewUserSaveFailureConsumer(usfChannel, mClient).Listen()
	}

	ueecChannel, err := rabbit.AddChannel("ueec")
	ok = onFailure(err, logcodes.ERROR, "Failed to create UpdateEmployeeEmpConsumer channel", "ask/task-service/index.go:86")
	if ok {
		go consumers.NewUpdateEmployeeEmpConsumer(ueecChannel, mClient).Listen()
	}

	// Rabbit Publishers
	uerpChannel, err := rabbit.AddChannel("uerp")
	ok = onFailure(err, logcodes.ERROR, "Failed to create UpdateEmployeeEmpConsumer channel", "ask/task-service/index.go:93")
	if ok {
		publishers.NewUpdateEmployeeRequeuePublisher(uerpChannel, mClient)
	}

	// gRPC Server
	err = grpc.NewGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.TASK_SERVICE, mClient).
		Listen(fmt.Sprintf("[task-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	ok = onFailure(err, logcodes.ERROR, "gRPC server failed", "task/task-service/index.go:101")
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
