package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net/http"
	taskPackage "task-service/proto"
	"task-service/services/mongoclient"
)

type RpcHandlers struct {
	mongo *mongoclient.MongoClient
}

func (r RpcHandlers) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.ResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r RpcHandlers) GetAllTasks(ctx context.Context, request *taskPackage.AllTaskRequest) (*taskPackage.AllTaskResponsePayload, error) {

	//TODO implement me
	panic("implement me")
}

func (r RpcHandlers) CreateTask(ctx context.Context, newTask *taskPackage.Task) (*taskPackage.ResponsePayload, error) {
	insertResponse, err := r.mongo.InsertOneTask(newTask, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var task taskPackage.Task
	err = r.mongo.FindOneTask(bson.D{{"_id", oid}}, &task, mongodb.TASK_DB, mongodb.TASK_COL)
	if err != nil {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}

	payload := taskPackage.ResponsePayload{
		Status: http.StatusCreated,
		Data:   &task,
	}
	return &payload, nil
}

func (r RpcHandlers) UpdateTask(ctx context.Context, task *taskPackage.Task) (*taskPackage.ResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}
