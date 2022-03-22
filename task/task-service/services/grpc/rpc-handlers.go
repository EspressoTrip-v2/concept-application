package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	var ds models.Task
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:25")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}

	err = r.mongo.FindOneAndDeleteTask(ctx, bson.D{{"_id", oid}}, &ds)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:31")
	if !ok {
		return nil, status.Errorf(codes.NotFound, "Task not found: %v", err.Error())
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusAccepted,
		Data:   ds.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, error) {
	var task models.Task
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
	var tasks []*models.Task
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

func (r *RpcHandlers) CreateTask(ctx context.Context, request *taskPackage.Task) (*taskPackage.TaskResponsePayload, error) {
	nTask := models.Task{
		Division:         request.GetDivision(),
		EmployeeId:       request.GetEmployeeId(),
		ShiftId:          request.GetShiftId(),
		ManagerId:        request.GetManagerId(),
		AllocatedTimeMin: request.GetAllocatedTimeMin(),
		SpecialRequests:  request.GetSpecialRequests(),
		Completed:        request.GetCompleted(),
		RejectionReason:  request.GetRejectionReason(),
	}
	// TODO: FINISH THIS
	//shiftId, err := primitive.ObjectIDFromHex(newTask.GetShiftId())
	//employeeId, err := primitive.ObjectIDFromHex(newTask.GetEmployeeId())

	insertResponse, err := r.mongo.InsertTask(ctx, &nTask)
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:99")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var task models.Task
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

func (r *RpcHandlers) UpdateTask(ctx context.Context, request *taskPackage.Task) (*taskPackage.TaskResponsePayload, error) {
	var ut models.Task
	update := bson.D{{"$set",
		bson.D{
			{"division", request.GetDivision()},
			{"employeeId", request.GetEmployeeId()},
			{"shiftId", request.GetShiftId()},
			{"managerId", request.GetManagerId()},
			{"allocatedTimeMin", request.GetAllocatedTimeMin()},
			{"specialRequests", request.GetSpecialRequests()},
			{"completed", request.GetCompleted()},
			{"rejectionReason", request.GetRejectionReason()},
		}}}
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:139")
	err = r.mongo.FindOneAndUpdateTask(ctx, bson.D{{"_id", oid}}, &ut, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:133")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   ut.ConvertToMessage(),
	}
	r.onSuccess(logcodes.INFO, "", "task/task-service/services/grpc/rpc-handlers.go:142",
		fmt.Sprintf("taskId: %v, division: %v", ut.Id, ut.Division))
	return &payload, nil
}

func (r *RpcHandlers) GetEmployee(ctx context.Context, request *taskPackage.EmployeeRequest) (*taskPackage.EmployeeResponsePayload, error) {
	var employee models.Employee
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
	var employees []*models.Employee
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

func (r *RpcHandlers) GetShift(ctx context.Context, request *taskPackage.ShiftRequest) (*taskPackage.ShiftResponsePayload, error) {
	var s models.Shift
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:46")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneShift(ctx, bson.D{{"_id", oid}}, &s)
	ok = r.onFailure(err, logcodes.ERROR, "Shift not found", "task/task-service/services/grpc/rpc-handlers.go:51")
	if !ok {
		return nil, status.Errorf(codes.NotFound, "Shift not found: %v", err.Error())
	}
	payload := taskPackage.ShiftResponsePayload{
		Status: http.StatusOK,
		Data:   s.ConvertToMessage(),
	}
	return &payload, nil
}

func (r *RpcHandlers) GetAllShifts(ctx context.Context, request *taskPackage.AllShiftRequest) (*taskPackage.AllShiftResponsePayload, error) {
	var shifts []*models.Shift
	var msgShifts []*taskPackage.Shift
	cursor, err := r.mongo.FindShifts(ctx, bson.D{})
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:66")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	err = cursor.All(ctx, &shifts)
	ok = r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:71")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	// Convert to gRPC message type
	for _, shift := range shifts {
		msgShifts = append(msgShifts, shift.ConvertToMessage())
	}

	payload := taskPackage.AllShiftResponsePayload{
		Status: http.StatusOK,
		Data:   msgShifts,
	}
	return &payload, nil
}

func (r *RpcHandlers) CreateShift(ctx context.Context, request *taskPackage.Shift) (*taskPackage.ShiftResponsePayload, error) {
	ns := models.Shift{
		Division: request.GetDivision(),
		Type:     request.GetType(),
		Start:    request.GetStart(),
		End:      request.GetEnd(),
	}
	insertResponse, err := r.mongo.InsertShift(ctx, &ns)
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:99")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var s models.Shift
	err = r.mongo.FindOneShift(ctx, bson.D{{"_id", oid}}, &s)
	ok = r.onFailure(err, logcodes.ERROR, "Shift not found", "task/task-service/services/grpc/rpc-handlers.go:106")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Shift not found: %v", err.Error()))
	}
	payload := taskPackage.ShiftResponsePayload{
		Status: http.StatusCreated,
		Data:   s.ConvertToMessage(),
	}
	r.onSuccess(logcodes.CREATED, "Task created", "task/task-service/services/grpc/rpc-handlers.go:115",
		fmt.Sprintf("shiftId: %v, division: %v", s.Id, s.Division))
	return &payload, nil
}

func (r *RpcHandlers) UpdateShift(ctx context.Context, request *taskPackage.Shift) (*taskPackage.ShiftResponsePayload, error) {
	var us models.Shift
	update := bson.D{{"$set",
		bson.D{
			{"type", request.GetType()},
			{"division", request.GetDivision()},
			{"start", request.GetStart()},
			{"end", request.GetEnd()}}}}

	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:273")
	err = r.mongo.FindOneAndUpdateShift(ctx, bson.D{{"_id", oid}}, &us, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	ok = r.onFailure(err, logcodes.ERROR, "Shift not found", "task/task-service/services/grpc/rpc-handlers.go:133")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Shift not found: %v", err.Error()))
	}

	payload := taskPackage.ShiftResponsePayload{
		Status: http.StatusCreated,
		Data:   us.ConvertToMessage(),
	}
	r.onSuccess(logcodes.INFO, "", "task/task-service/services/grpc/rpc-handlers.go:142",
		fmt.Sprintf("shifId: %v, division: %v", us.Id, us.Division))
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
