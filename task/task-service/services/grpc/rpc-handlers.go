package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"net/http"
	localLogger "task-service/local-logger"
	"task-service/models"
	taskPackage "task-service/proto"
	"task-service/services/mongoclient"
)

type RpcHandlers struct {
	mongo *mongoclient.MongoClient
}

func (r *RpcHandlers) DeleteTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, error) {
	var deletedTask models.TaskItem
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:26", err.Error())
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}

	err = r.mongo.FindOneAndDeleteTask(ctx, bson.D{{"_id", oid}}, &deletedTask)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "Task not found: %v", err.Error())
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusAccepted,
		Data:   deletedTask.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, error) {
	var task models.TaskItem
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:46", err.Error())
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "Task not found: %v", err.Error())
	}
	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusOK,
		Data:   task.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) GetAllTasks(ctx context.Context, request *taskPackage.AllTaskRequest) (*taskPackage.AllTaskResponsePayload, error) {
	var tasks []*models.TaskItem
	var msgTasks []*taskPackage.Task
	cursor, err := r.mongo.FindTasks(ctx, bson.D{})
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:65", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	if err := cursor.All(ctx, &tasks); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:69", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	// Convert to gRPC message type
	for _, task := range tasks {
		msgTasks = append(msgTasks, task.ConvertToMessage())
	}

	payload := taskPackage.AllTaskResponsePayload{
		Status: http.StatusOK,
		Data:   msgTasks,
	}
	return &payload, nil
}

func (r *RpcHandlers) CreateTask(ctx context.Context, newTask *taskPackage.Task) (*taskPackage.TaskResponsePayload, error) {
	nTask := models.TaskItem{
		Division:         newTask.GetDivision(),
		EmployeeId:       newTask.GetEmployeeId(),
		ShiftId:          newTask.GetShiftId(),
		ManagerId:        newTask.GetManagerId(),
		AllocatedTimeMin: newTask.GetAllocatedTimeMin(),
		SpecialRequests:  newTask.GetSpecialRequests(),
		Completed:        newTask.GetCompleted(),
		RejectionReason:  newTask.GetRejectionReason(),
	}
	insertResponse, err := r.mongo.InsertOneTask(ctx, &nTask)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:82", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var task models.TaskItem
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	if err != nil {
		return nil, err
	}
	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   task.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) UpdateTask(ctx context.Context, task *taskPackage.Task) (*taskPackage.TaskResponsePayload, error) {
	var updatedTask models.TaskItem
	oid, err := primitive.ObjectIDFromHex(task.GetId())
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

	err = r.mongo.FindOneAndUpdateTask(ctx, bson.D{{"_id", oid}}, &updatedTask, update, nil)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   updatedTask.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) GetEmployee(ctx context.Context, request *taskPackage.EmployeeRequest) (*taskPackage.EmployeeResponsePayload, error) {
	var employee models.EmployeeItem
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:151", err.Error())
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneEmployee(ctx, bson.D{{"_id", oid}}, &employee)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "Employee not found: %v", err.Error())
	}
	payload := taskPackage.EmployeeResponsePayload{
		Status: http.StatusOK,
		Data:   employee.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) GetAllEmployees(ctx context.Context, request *taskPackage.AllEmployeeRequest) (*taskPackage.AllEmployeeResponsePayload, error) {
	var employees []*models.EmployeeItem
	var msgEmployees []*taskPackage.Employee
	cursor, err := r.mongo.FindEmployees(ctx, bson.D{})
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:170", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	if err := cursor.All(ctx, &employees); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:174", err.Error())
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	// Convert to gRPC message type
	for _, employee := range employees {
		msgEmployees = append(msgEmployees, employee.ConvertToMessage())
	}

	payload := taskPackage.AllEmployeeResponsePayload{
		Status: http.StatusOK,
		Data:   msgEmployees,
	}
	return &payload, nil
}
