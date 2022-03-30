package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/grpcsevices/grpcports"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
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
}

func GrpcClient() *GrpcClientInstance {
	if grpcClient == nil {
		grpcClient = &GrpcClientInstance{grpcports.TASK_SERVICE_DNS, nil, nil}
		return grpcClient
	}
	return grpcClient
}
func (c *GrpcClientInstance) Connect(msg string) {
	var err error

	c.connection, err = grpc.Dial(string(c.port), grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithUnaryInterceptor(otelgrpc.UnaryClientInterceptor()),
		grpc.WithStreamInterceptor(otelgrpc.StreamClientInterceptor()))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC client failed to connect to server", "task/task-api/services/grpc-task-client.go:36", err.Error())
	} else {
		fmt.Println(msg)
	}
	client := taskPackage.NewTaskServiceClient(c.connection)
	c.client = client
}

func (c *GrpcClientInstance) Close() {
	c.connection.Close()
}

func (c GrpcClientInstance) CreateTask(ctx context.Context, data *taskPackage.Task) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.CreateTask(ctx, data)

	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetTask(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetAllTasks(ctx context.Context, request *taskPackage.AllTaskRequest) (*taskPackage.AllTaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetAllTasks(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) UpdateTask(ctx context.Context, data *taskPackage.Task) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.UpdateTask(ctx, data)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) DeleteTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, *libErrors.CustomError) {
	response, err := c.client.DeleteTask(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetEmployee(ctx context.Context, request *taskPackage.EmployeeRequest) (*taskPackage.EmployeeResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetEmployee(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetAllEmployees(ctx context.Context, request *taskPackage.AllEmployeeRequest) (*taskPackage.AllEmployeeResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetAllEmployees(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) CreateShift(ctx context.Context, data *taskPackage.Shift) (*taskPackage.ShiftResponsePayload, *libErrors.CustomError) {
	response, err := c.client.CreateShift(ctx, data)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetShift(ctx context.Context, request *taskPackage.ShiftRequest) (*taskPackage.ShiftResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetShift(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) GetAllShifts(ctx context.Context, request *taskPackage.AllShiftRequest) (*taskPackage.AllShiftResponsePayload, *libErrors.CustomError) {
	response, err := c.client.GetAllShifts(ctx, request)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}

func (c GrpcClientInstance) UpdateShift(ctx context.Context, data *taskPackage.Shift) (*taskPackage.ShiftResponsePayload, *libErrors.CustomError) {
	response, err := c.client.UpdateShift(ctx, data)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return response, nil
}
