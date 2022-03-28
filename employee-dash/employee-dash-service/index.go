package main

import (
	"context"
	"employee-dash-service/events/consumers"
	"employee-dash-service/events/publishers"
	localLogger "employee-dash-service/local-logger"
	"employee-dash-service/services/grpc"
	"employee-dash-service/services/mongoclient"
	"employee-dash-service/tracer"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/grpcsevices/grpcports"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"os"
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
	ok := onFailure(err, logcodes.ERROR, "Open-telemetry error", "employee-dash/employee-dash-service/index.go:38")
	if ok {
		defer func() {
			err := traceProvider.Shutdown(context.Background())
			if err != nil {
				onFailure(libErrors.NewBadRequestError(err.Error()), logcodes.ERROR, "Trace provider shutdown error", "employee-dash/employee-dash-service/index.go:43")
			}
		}()
	}

	// RabbitMQ
	var mClient *mongoclient.MongoClient
	rabbit, err := rabbitmq.GetRabbitClient(os.Getenv("RABBIT_URI"), "employee-dash-service")
	if err != nil {
		log.Fatalln("[employee-dash-service:rabbitmq:]: Failed to connect to RabbitMQ message bus")
	}

	// Logging
	logChannel, err := rabbit.AddChannel("log")
	ok = onFailure(err, logcodes.ERROR, "", "ask/employee-dash-service/index.go:57")
	if ok {
		localLogger.Start(logChannel, microserviceNames.TASK_SERVICE)
	}

	// MongoDB
	mClient, err = mongoclient.GetMongoDB()
	onFailure(err, logcodes.ERROR, "MongoDB error", "employee-dash/employee-dash-service/index.go:64")
	defer mClient.Disconnect()

	// Rabbit Consumers
	cecChannel, err := rabbit.AddChannel("cec")
	ok = onFailure(err, logcodes.ERROR, "Failed to create CreateEmployeeConsumer channel", "ask/employee-dash-service/index.go:69")
	if ok {
		go consumers.NewCreateEmployeeConsumer(cecChannel, mClient).Listen()
	}

	decChannel, err := rabbit.AddChannel("dec")
	ok = onFailure(err, logcodes.ERROR, "Failed to create DeleteEmployeeConsumer channel", "ask/employee-dash-service/index.go:75")
	if ok {
		go consumers.NewDeleteEmployeeConsumer(decChannel, mClient).Listen()
	}

	usfChannel, err := rabbit.AddChannel("usf")
	ok = onFailure(err, logcodes.ERROR, "Failed to create UserSaveFailureConsumer channel", "ask/employee-dash-service/index.go:81")
	if ok {
		go consumers.NewUserSaveFailureConsumer(usfChannel, mClient).Listen()
	}

	ueecChannel, err := rabbit.AddChannel("ueec")
	ok = onFailure(err, logcodes.ERROR, "Failed to create UpdateEmployeeEmpConsumer channel", "ask/employee-dash-service/index.go:87")
	if ok {
		go consumers.NewUpdateEmployeeEmpConsumer(ueecChannel, mClient).Listen()
	}

	// Rabbit Publishers
	uerpChannel, err := rabbit.AddChannel("uerp")
	ok = onFailure(err, logcodes.ERROR, "Failed to create UpdateEmployeeEmpConsumer channel", "ask/employee-dash-service/index.go:94")
	if ok {
		publishers.NewUpdateEmployeeRequeuePublisher(uerpChannel, mClient)
	}

	// gRPC Client
	client := grpc.GrpcClient()
	client.Connect(fmt.Sprintf("[employee-dash-service:gRPC-client]: Connected on %v\n", grpcports.AUTH_SERVICE_DNS))
	defer client.Close()

	// gRPC Server
	err = grpc.NewEmployeeDashGrpcServer(os.Getenv("GRPC_SERVER_PORT"), microserviceNames.EMPLOYEE_DASH_SERVICE, mClient).
		Listen(fmt.Sprintf("[employee-dash-service:gRPC-server]: Listening on %v\n", os.Getenv("GRPC_SERVER_PORT")))
	ok = onFailure(err, logcodes.ERROR, "gRPC server failed", "employee-dash/employee-dash-service/index.go:107")
	if ok != true {
		log.Fatalln("[employee-dash-service:gRPC-server]: Failed to connect to gRPC server")
	}

}

func onFailure(err *libErrors.CustomError, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Message[0])
		log.Printf("[employee-dash-service:error]: Service start up error -> %v", message)
		return false
	}
	return true
}
