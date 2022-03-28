package main

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/grpcsevices/grpcports"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"net/http"
	"os"
	localLogger "task-api/local-logger"
	"task-api/services/grpc"
	"task-api/tacer"
	"time"
)

var PORT string

func envCheck() {
	if os.Getenv("RABBIT_URI") == "" {
		log.Fatalln("RABBIT_URI must be defined")
	}
	if os.Getenv("JWT_KEY") == "" {
		log.Fatalln("JWT_KEY must be defined")
	}
	if os.Getenv("PORT") == "" {
		PORT = "3000"
	} else {
		PORT = os.Getenv("PORT")
	}

}

func startServer(route http.Handler, logMsg string) {
	server := http.Server{
		Addr:         fmt.Sprintf(":%v", PORT),
		Handler:      route,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	fmt.Println(logMsg)
	err := server.ListenAndServe()
	if err != nil {
		e := libErrors.NewDatabaseError("Failed to connect mux server")
		onFailure(e, logcodes.ERROR, "Service error", "task-api/index.go:44")
		log.Fatalln("[task-api:mux]: Failed to connect mux server")
	}
}

func main() {
	envCheck()

	// Tracer
	traceProvider, err := tacer.NewTraceProvider("jaeger")
	ok := onFailure(err, logcodes.ERROR, "Open-telemetry error", "task/task-api/index.go:59")
	if ok {
		defer func() {
			err := traceProvider.Shutdown(context.Background())
			if err != nil {
				onFailure(libErrors.NewBadRequestError(err.Error()), logcodes.ERROR, "Trace provider shutdown error", "task/task-api/index.go:64")
			}
		}()
	}

	// RabbitMQ
	rabbit, err := rabbitmq.GetRabbitClient(os.Getenv("RABBIT_URI"), "task-service")
	if err != nil {
		log.Fatalln("[task-api:rabbitmq]: Failed to connect to RabbitMQ message bus")
	}

	// Logging
	logChannel, err := rabbit.AddChannel("log")
	ok = onFailure(err, logcodes.ERROR, "", "task/task-service/index.go:75")
	if ok == true {
		localLogger.Start(logChannel, microserviceNames.TASK_API)
	}

	// GRPC
	client := grpc.GrpcClient()
	client.Connect(fmt.Sprintf("[task-api:gRPC-client]: Connected on %v\n", grpcports.TASK_SERVICE_DNS))
	defer client.Close()

	// HTTP Server
	router := GetRouter()
	startServer(router, fmt.Sprintf("[task-api:mux-service]: Listening port %v", PORT))

}

func onFailure(err *libErrors.CustomError, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Message[0])
		log.Printf("[task-service:error]: Service start up error -> %v", message)
		return false
	}
	return true
}
