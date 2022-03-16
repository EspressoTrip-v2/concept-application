package main

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/grpcsevices/grpcports"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"net/http"
	"os"
	localLogger "task-api/local-logger"
	"task-api/services/grpc"
	"time"
)

var PORT string

func envCheck() {
	if os.Getenv("RABBIT_URI") == "" {
		log.Fatalln("RABBIT_URI must be defined")
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
		fmt.Printf("[task-api:error]: Service start up error -> %v\n", err.Error())
		localLogger.Log(logcodes.ERROR, "Service error", "task-api/index.go:38", err.Error())
	}
}

func main() {
	envCheck()
	// RabbitMQ
	rabbit, err := rabbitmq.StartRabbitClient(os.Getenv("RABBIT_URI"), "task-api")

	// Logger
	localLogger.Start(rabbit, microserviceNames.TASK_API)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "RabbitMQ connection failed", "task-service/index.go:32", err.Message)
	}

	// GRPC
	client := grpc.GrpcClient()
	client.Connect(fmt.Sprintf("[task-api:gRPC-client]: Conneted on %v\n", grpcports.TASK_SERVICE_DNS))
	defer client.Close()

	// HTTP Server
	router := GetRouter()
	startServer(router, fmt.Sprintf("[task-api:mux-service]: Listening port %v", PORT))

}
