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
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:25")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}

	err = r.mongo.FindOneAndDeleteTask(ctx, bson.D{{"_id", oid}}, &deletedTask)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:31")
	if !ok {
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
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:46")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:51")
	if !ok {
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
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:66")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	err = cursor.All(ctx, &tasks)
	ok = r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:71")
	if !ok {
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
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:99")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var task models.TaskItem
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:106")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   task.ConvertToMessage(),
	}
	r.onSuccess(logcodes.CREATED, "Task created", "task/task-service/services/grpc/rpc-handlers.go:115",
		fmt.Sprintf("taskId: %v, division: %v", task.Id, task.Division))
	return &payload, nil
}

func (r *RpcHandlers) UpdateTask(ctx context.Context, task *taskPackage.Task) (*taskPackage.TaskResponsePayload, error) {
	var updatedTask models.TaskItem
	update := bson.D{{"$set",
		bson.D{{"division", task.GetDivision()},
			{"employeeId", task.GetEmployeeId()},
			{"shiftId", task.GetShiftId()},
			{"managerId", task.GetManagerId()},
			{"allocatedTimeMin", task.GetAllocatedTimeMin()},
			{"specialRequests", task.GetSpecialRequests()},
			{"completed", task.GetCompleted()},
			{"rejectionReason", task.GetRejectionReason()}}}}

	err := r.mongo.FindOneAndUpdateTask(ctx, bson.D{{"_id", task.GetId()}}, &updatedTask, update, nil)
	ok := r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:133")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   updatedTask.ConvertToMessage(),
	}
	r.onSuccess(logcodes.INFO, "", "task/task-service/services/grpc/rpc-handlers.go:142",
		fmt.Sprintf("taskId: %v, division: %v", updatedTask.Id, updatedTask.Division))
	return &payload, nil
}

func (r *RpcHandlers) GetEmployee(ctx context.Context, request *taskPackage.EmployeeRequest) (*taskPackage.EmployeeResponsePayload, error) {
	var employee models.EmployeeItem
	err := r.mongo.FindOneEmployee(ctx, bson.D{{"_id", request.GetId()}}, &employee)
	ok := r.onFailure(err, logcodes.ERROR, "Employee not found", "task/task-service/services/grpc/rpc-handlers.go:150")
	if !ok {
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
	r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:165")

	err = cursor.All(ctx, &employees)
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:168")
	if !ok {
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

func (r *RpcHandlers) onSuccess(logCode logcodes.LogCodes, message string, origin string, detail string) {
	localLogger.Log(logCode, message, origin, detail)
}

func (r *RpcHandlers) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		fmt.Printf("[task-service:gRPC-handlers]: %v -> %v\n", message, err.Error())
		return false
	}
	return true
}
