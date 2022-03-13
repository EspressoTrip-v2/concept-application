package main

import (
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"github.com/EspressoTrip-v2/concept-go-common/rabbitmq"
	"log"
	"net/http"
	"os"
	localLogger "task-api/local-logger"
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
	// start rabbit connection
	rabbit, err := rabbitmq.StartRabbitClient(os.Getenv("RABBIT_URI"), "task-api")
	if err != nil {
		fmt.Println(err.Message)
	}
	// start logger
	localLogger.Start(rabbit, microserviceNames.TASK_API)
	localLogger.Log(logcodes.CREATED, "App start up", "task-api", "test message")

	// get router and start the server
	router := GetRouter()
	startServer(router, fmt.Sprintf("[task-api:mux-service]: Listening port %v", PORT))

}
