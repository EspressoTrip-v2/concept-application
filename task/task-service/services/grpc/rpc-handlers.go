package grpc

import (
	context "context"
	taskPackage "task-service/proto"
)

// RpcHandlers assign the rpc handlers to this struct
type RpcHandlers struct{}

func (r RpcHandlers) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (r RpcHandlers) GetAllTasks(ctx context.Context, request *taskPackage.AllTaskRequest) (*taskPackage.AllTaskResponse, error) {
	//TODO implement me
	panic("implement me")
}

func (r RpcHandlers) CreateTask(ctx context.Context, task *taskPackage.Task) (*taskPackage.ResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r RpcHandlers) UpdateTask(ctx context.Context, task *taskPackage.Task) (*taskPackage.ResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}
