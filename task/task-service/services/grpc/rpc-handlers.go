package grpc

import (
	"context"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/mongodb"
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
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:27")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}

	err = r.mongo.FindOneAndDeleteTask(ctx, bson.D{{"_id", oid}}, &ds)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:33")
	if !ok {
		return nil, status.Errorf(codes.NotFound, "Task not found: %v", err.Error())
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusAccepted,
		Data:   ds.ConvertToMessage(),
	}

	var employee models.Employee
	err = r.mongo.FindOneEmployee(ctx, bson.D{{"_id", ds.EmployeeId}}, &employee)
	ok = r.onFailure(err, logcodes.ERROR, "Employee not found", "task/task-service/services/grpc/rpc-handlers.go:45")
	if ok && employee.NumberTasks != 0 {
		var ue models.Employee
		update := bson.D{{"$set", bson.D{{"numberTasks", employee.NumberTasks - 1}}}}
		err = r.mongo.FindOneAndUpdateEmployee(ctx, bson.D{{"_id", ds.EmployeeId}}, &ue, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
		ok := r.onFailure(err, logcodes.ERROR, "Employee task number update failed", "task/task-service/services/grpc/rpc-handlers.go:50")
		if ok {
			r.onSuccess(logcodes.UPDATED, "Employee task number updated",
				"task/task-service/services/grpc/rpc-handlers.go:52", fmt.Sprintf("Task number updated for email: %v, employeeId: %v", employee.Email, employee.Id))
		}
	}
	r.onSuccess(logcodes.DELETED, "Task deleted", "task/task-service/services/grpc/rpc-handlers.go:56",
		fmt.Sprintf("Task id: %v, division: %v", ds.Id, ds.Division))
	return &payload, nil
}

func (r *RpcHandlers) GetTask(ctx context.Context, request *taskPackage.TaskRequest) (*taskPackage.TaskResponsePayload, error) {
	var task models.Task
	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:64")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:69")
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
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:84")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	err = cursor.All(ctx, &tasks)
	ok = r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:89")
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
	var employee models.Employee
	shiftId, err := primitive.ObjectIDFromHex(request.GetShiftId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:108")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Invalid object id error: %v", err.Error()))
	}
	employeeId, err := primitive.ObjectIDFromHex(request.GetEmployeeId())
	ok = r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:113")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Invalid object id error: %v", err.Error()))
	}
	mngId, err := primitive.ObjectIDFromHex(request.GetManagerId())
	ok = r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:118")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Invalid object id error: %v", err.Error()))
	}

	nTask := models.Task{
		Division:         request.GetDivision(),
		EmployeeId:       employeeId,
		ShiftId:          shiftId,
		ManagerId:        mngId,
		AllocatedTimeMin: request.GetAllocatedTimeMin(),
		SpecialRequests:  request.GetSpecialRequests(),
		Completed:        request.GetCompleted(),
		RejectionReason:  request.GetRejectionReason(),
	}

	shiftCount, err := r.mongo.Count(ctx, mongodb.TASK_DB, mongodb.SHIFT_COL, bson.D{{"_id", shiftId}})
	ok = r.onFailure(err, logcodes.ERROR, "Error getting shift document count", "task/task-service/services/grpc/rpc-handlers.go:135")
	if shiftCount == 0 || !ok {
		return nil, status.Errorf(codes.NotFound, "Shift not found")
	}

	err = r.mongo.FindOneEmployee(ctx, bson.D{{"_id", employeeId}}, &employee)
	ok = r.onFailure(err, logcodes.ERROR, "Error getting employee document", "task/task-service/services/grpc/rpc-handlers.go:141")
	if !ok {
		return nil, status.Errorf(codes.NotFound, "Employee not found")
	}

	insertResponse, err := r.mongo.InsertTask(ctx, &nTask)
	ok = r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:147")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var task models.Task
	err = r.mongo.FindOneTask(ctx, bson.D{{"_id", oid}}, &task)
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:154")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   task.ConvertToMessage(),
	}
	r.onSuccess(logcodes.CREATED, "Task created", "task/task-service/services/grpc/rpc-handlers.go:163",
		fmt.Sprintf("taskId: %v, division: %v", task.Id, task.Division))

	employee.NumberTasks = employee.NumberTasks + 1
	var ue models.Employee
	update := bson.D{{"$set", bson.D{{"numberTasks", employee.NumberTasks}}}}
	err = r.mongo.FindOneAndUpdateEmployee(ctx, bson.D{{"_id", employeeId}}, &ue, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	ok = r.onFailure(err, logcodes.ERROR, "Employee task number update failed", "task/task-service/services/grpc/rpc-handlers.go:170")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Employee update failed: %v", err.Error()))
	}
	return &payload, nil
}

func (r *RpcHandlers) UpdateTask(ctx context.Context, request *taskPackage.Task) (*taskPackage.TaskResponsePayload, error) {

	shiftId, err := primitive.ObjectIDFromHex(request.GetShiftId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:180")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Invalid object id error: %v", err.Error()))
	}
	employeeId, err := primitive.ObjectIDFromHex(request.GetEmployeeId())
	ok = r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:185")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Invalid object id error: %v", err.Error()))
	}
	mngId, err := primitive.ObjectIDFromHex(request.GetManagerId())
	ok = r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:190")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Invalid object id error: %v", err.Error()))
	}

	shiftCount, err := r.mongo.Count(ctx, mongodb.TASK_DB, mongodb.SHIFT_COL, bson.D{{"_id", shiftId}})
	ok = r.onFailure(err, logcodes.ERROR, "Error getting shift document count", "task/task-service/services/grpc/rpc-handlers.go:196")
	if shiftCount == 0 || !ok {
		return nil, status.Errorf(codes.NotFound, "Shift not found")
	}

	employeeCount, err := r.mongo.Count(ctx, mongodb.TASK_DB, mongodb.EMPLOYEE_COL, bson.D{{"_id", employeeId}})
	ok = r.onFailure(err, logcodes.ERROR, "Error getting employee document count", "task/task-service/services/grpc/rpc-handlers.go:202")
	if employeeCount == 0 || !ok {
		return nil, status.Errorf(codes.NotFound, "Employee not found")
	}

	var ut models.Task
	update := bson.D{{"$set",
		bson.D{
			{"division", request.GetDivision()},
			{"employeeId", employeeId},
			{"shiftId", shiftId},
			{"managerId", mngId},
			{"allocatedTimeMin", request.GetAllocatedTimeMin()},
			{"specialRequests", request.GetSpecialRequests()},
			{"completed", request.GetCompleted()},
			{"rejectionReason", request.GetRejectionReason()},
		}}}

	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok = r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:221")
	err = r.mongo.FindOneAndUpdateTask(ctx, bson.D{{"_id", oid}}, &ut, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	ok = r.onFailure(err, logcodes.ERROR, "Task not found", "task/task-service/services/grpc/rpc-handlers.go:223")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Task not found: %v", err.Error()))
	}

	payload := taskPackage.TaskResponsePayload{
		Status: http.StatusCreated,
		Data:   ut.ConvertToMessage(),
	}
	r.onSuccess(logcodes.UPDATED, "", "task/task-service/services/grpc/rpc-handlers.go:232",
		fmt.Sprintf("taskId: %v, division: %v", ut.Id, ut.Division))
	return &payload, nil
}

func (r *RpcHandlers) GetEmployee(ctx context.Context, request *taskPackage.EmployeeRequest) (*taskPackage.EmployeeResponsePayload, error) {
	var employee models.Employee
	err := r.mongo.FindOneEmployee(ctx, bson.D{{"_id", request.GetId()}}, &employee)
	ok := r.onFailure(err, logcodes.ERROR, "Employee not found", "task/task-service/services/grpc/rpc-handlers.go:240")
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
	r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:255")

	err = cursor.All(ctx, &employees)
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:258")
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
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:278")
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, fmt.Sprintf("Payload error: %v", err.Error()))
	}
	err = r.mongo.FindOneShift(ctx, bson.D{{"_id", oid}}, &s)
	ok = r.onFailure(err, logcodes.ERROR, "Shift not found", "task/task-service/services/grpc/rpc-handlers.go:283")
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
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:298")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	err = cursor.All(ctx, &shifts)
	ok = r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:303")
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
	ok := r.onFailure(err, logcodes.ERROR, "MongoDB CRUD operation error", "task/task-service/services/grpc/rpc-handlers.go:327")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Mongo CRUD operation failure: %v", err.Error()))
	}
	oid := insertResponse.InsertedID.(primitive.ObjectID)
	var s models.Shift
	err = r.mongo.FindOneShift(ctx, bson.D{{"_id", oid}}, &s)
	ok = r.onFailure(err, logcodes.ERROR, "Shift not found", "task/task-service/services/grpc/rpc-handlers.go:334")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Shift not found: %v", err.Error()))
	}
	payload := taskPackage.ShiftResponsePayload{
		Status: http.StatusCreated,
		Data:   s.ConvertToMessage(),
	}
	r.onSuccess(logcodes.CREATED, "Task created", "task/task-service/services/grpc/rpc-handlers.go:342",
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
			{"end", request.GetEnd()},
			{"shiftName", request.GetShiftName()}}}}

	oid, err := primitive.ObjectIDFromHex(request.GetId())
	ok := r.onFailure(err, logcodes.ERROR, "Object id conversion failure", "task/task-service/services/grpc/rpc-handlers.go:358")
	err = r.mongo.FindOneAndUpdateShift(ctx, bson.D{{"_id", oid}}, &us, update, options.FindOneAndUpdate().SetReturnDocument(options.After))
	ok = r.onFailure(err, logcodes.ERROR, "Shift not found", "task/task-service/services/grpc/rpc-handlers.go:360")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Shift not found: %v", err.Error()))
	}

	payload := taskPackage.ShiftResponsePayload{
		Status: http.StatusCreated,
		Data:   us.ConvertToMessage(),
	}
	r.onSuccess(logcodes.UPDATED, "Shift updated", "task/task-service/services/grpc/rpc-handlers.go:369",
		fmt.Sprintf("shiftId: %v, division: %v", us.Id, us.Division))
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
