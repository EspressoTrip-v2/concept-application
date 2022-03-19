package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/grpcsevices/grpcports"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	localLogger "task-api/local-logger"
	taskPackage "task-api/proto"
)

var grpcClient *GrpcClientInstance

type GrpcClientInstance struct {
	port       grpcports.GrpcServicePortDns
	client     taskPackage.TaskServiceClient
	connection *grpc.ClientConn
	ctx        context.Context
}

func GrpcClient() *GrpcClientInstance {
	if grpcClient == nil {
		grpcClient = &GrpcClientInstance{grpcports.TASK_SERVICE_DNS, nil, nil, context.Background()}
		return grpcClient
	}
	return grpcClient
}
func (c *GrpcClientInstance) Connect(msg string) {
	var err error

	c.connection, err = grpc.Dial(string(c.port), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC client failed to connect to server", "task/task-api/services/grpc-client.go:35", err.Error())
	} else {
		fmt.Println(msg)
	}
	client := taskPackage.NewTaskServiceClient(c.connection)
	c.client = client
}

func (c *GrpcClientInstance) Close() {
	c.connection.Close()
}

func (c GrpcClientInstance) CreateTask(data *taskPackage.Task) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.CreateTask(c.ctx, data)

	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetTask(request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetTask(c.ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetAllTasks(request *taskPackage.AllTaskRequest) (*taskPackage.AllTaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetAllTasks(c.ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) UpdateTask(data *taskPackage.Task) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.UpdateTask(c.ctx, data)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) DeleteTask(request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.DeleteTask(c.ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetEmployee(request *taskPackage.EmployeeRequest) (*taskPackage.EmployeeResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetEmployee(c.ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetAllEmployees(request *taskPackage.AllEmployeeRequest) (*taskPackage.AllEmployeeResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetAllEmployees(c.ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}
