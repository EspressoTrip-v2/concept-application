package grpc

import (
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"google.golang.org/grpc"
	"net"
	localLogger "task-service/local-logger"
	taskPackage "task-service/proto"
	"task-service/services/mongoclient"
)

type GrpcServer struct {
	port         string
	microservice microserviceNames.MicroserviceNames
	mongo        *mongoclient.MongoClient
}

func NewGrpcServer(port string, microservice microserviceNames.MicroserviceNames, mongo *mongoclient.MongoClient) *GrpcServer {
	return &GrpcServer{port: port, microservice: microservice, mongo: mongo}

}

func (g *GrpcServer) Listen(logMsg string) *libErrors.CustomError {
	// bind port
	listener, err := net.Listen("tcp", g.port)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Could not bind gRPC port", "task-service/services/grpc-server.go:30", err.Error())
		g.failOnError(err)
		return libErrors.GrpcTranslator(err)
	}
	// create server
	server := grpc.NewServer()

	// register rpc methods
	taskPackage.RegisterTaskServiceServer(server, &RpcHandlers{mongo: g.mongo})

	// serve
	fmt.Println(logMsg)
	if err := server.Serve(listener); err != nil {
		localLogger.Log(logcodes.ERROR, "Failed to start gRPC server", "task-service/services/grpc-server.go:43", err.Error())
		g.failOnError(err)
		return libErrors.GrpcTranslator(err)
	}
	return nil
}

func (g *GrpcServer) failOnError(err error) {
	if err != nil {
		fmt.Printf("[gRPC:%v]: Server error: %v\n", g.microservice, err.Error())
	}
}
