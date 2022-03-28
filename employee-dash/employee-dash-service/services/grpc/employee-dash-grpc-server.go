package grpc

import (
	localLogger "employee-dash-service/local-logger"
	employeePackage "employee-dash-service/proto/employee/proto"
	"employee-dash-service/services/mongoclient"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"google.golang.org/grpc"
	"net"
)

type EmployeeDashGrpcServer struct {
	port         string
	microservice microserviceNames.MicroserviceNames
	mongo        *mongoclient.MongoClient
}

func NewEmployeeDashGrpcServer(port string, microservice microserviceNames.MicroserviceNames, mongo *mongoclient.MongoClient) *EmployeeDashGrpcServer {
	return &EmployeeDashGrpcServer{port: port, microservice: microservice, mongo: mongo}

}

func (g *EmployeeDashGrpcServer) Listen(logMsg string) *libErrors.CustomError {
	// bind port
	listener, err := net.Listen("tcp", g.port)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Could not bind gRPC port", "employee-dash-service/services/grpc-server.go:31", err.Error())
		g.failOnError(err)
		return libErrors.GrpcTranslator(err)
	}
	// create server
	server := grpc.NewServer(grpc.UnaryInterceptor(otelgrpc.UnaryServerInterceptor()),
		grpc.StreamInterceptor(otelgrpc.StreamServerInterceptor()))

	// register rpc methods
	employeePackage.RegisterEmployeeServiceServer(server, &EmployeeDashRpcHandlers{mongo: g.mongo})

	// serve
	fmt.Println(logMsg)
	if err := server.Serve(listener); err != nil {
		localLogger.Log(logcodes.ERROR, "Failed to start gRPC server", "employee-dash-service/services/grpc-server.go:45", err.Error())
		g.failOnError(err)
		return libErrors.GrpcTranslator(err)
	}
	return nil
}

func (g *EmployeeDashGrpcServer) failOnError(err error) {
	if err != nil {
		fmt.Printf("[gRPC:%v]: Server error: %v\n", g.microservice, err.Error())
	}
}
