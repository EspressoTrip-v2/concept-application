package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net/http"
	localLogger "task-service/local-logger"
	taskPackage "task-service/proto"
	"task-service/services/mongoclient"
)

type RpcHandlers struct {
	mongo *mongoclient.MongoClient
}

func (r RpcHandlers) DeleteTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.ResponsePayload, error) {
	var deletedTask taskPackage.Task
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:26", err.Error())
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}

	err = r.mongo.FindOneAndDeleteTask(ctx, bson.D{{"_id", oid}}, &deletedTask, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:32", err.Error())
		return nil, status.Errorf(codes.Internal, "MongoDB CRUD operation error: %v", err.Error())
	}
	payload := taskPackage.ResponsePayload{
		Status: http.StatusAccepted,
		Data:   &deletedTask,
	}
	return &payload, nil
}

func (r RpcHandlers) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.ResponsePayload, error) {
	var task taskPackage.Task
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:46", err.Error())
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:51", err.Error())
		return nil, status.Errorf(codes.Internal, "MongoDB CRUD operation error: %v", err.Error())
	}
	payload := taskPackage.ResponsePayload{
		Status: http.StatusOK,
		Data:   &task,
	}
	return &payload, nil
}

func (r RpcHandlers) GetAllTasks(ctx context.Context, request *taskPackage.AllTaskRequest) (*taskPackage.AllTaskResponsePayload, error) {
	var tasks []*taskPackage.Task
	cursor, err := r.mongo.FindTasks(ctx, bson.D{}, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:65", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	if err := cursor.All(ctx, &tasks); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:69", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	payload := taskPackage.AllTaskResponsePayload{
		Status: http.StatusOK,
		Data:   tasks,
	}
	return &payload, nil
}

func (r RpcHandlers) CreateTask(ctx context.Context, newTask *taskPackage.Task) (*taskPackage.ResponsePayload, error) {
	insertResponse, err := r.mongo.InsertOneTask(ctx, newTask, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:82", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var task taskPackage.Task
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:89", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	payload := taskPackage.ResponsePayload{
		Status: http.StatusCreated,
		Data:   &task,
	}
	return &payload, nil
}

func (r RpcHandlers) UpdateTask(ctx context.Context, task *taskPackage.Task) (*taskPackage.ResponsePayload, error) {
	var updatedTask taskPackage.Task
	oid, err := primitive.ObjectIDFromHex(task.GetXId())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:103", err.Error())
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	update := bson.D{{"$set",
		bson.D{{"division", task.GetDivision()},
			{"employeeId", task.GetEmployeeId()},
			{"shiftId", task.GetShiftId()},
			{"managerId", task.GetManagerId()},
			{"allocatedTimeMin", task.GetAllocatedTimeMin()},
			{"specialRequests", task.GetSpecialRequests()},
			{"completed", task.GetCompleted()},
			{"rejectionReason", task.GetRejectionReason()}}}}

	err = r.mongo.FindOneAndUpdateTask(ctx, bson.D{{"_id", oid}}, &updatedTask, update, nil, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:118", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}

	payload := taskPackage.ResponsePayload{
		Status: http.StatusCreated,
		Data:   &updatedTask,
	}
	return &payload, nil
}
