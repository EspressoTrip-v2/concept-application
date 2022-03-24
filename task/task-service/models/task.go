package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	taskPackage "task-service/proto"
)

// Task is the task data structure used by the task service
type Task struct {
	Id               string             `bson:"_id,omitempty"`
	Division         string             `bson:"division"`
	EmployeeId       primitive.ObjectID `bson:"employeeId"`
	ShiftId          primitive.ObjectID `bson:"shiftId"`
	ManagerId        primitive.ObjectID `bson:"managerId"`
	AllocatedTimeMin int32              `bson:"allocatedTimeMin"`
	SpecialRequests  string             `bson:"specialRequests"`
	Completed        string             `bson:"completed"`
	RejectionReason  string             `bson:"rejectionReason"`
}

// ConvertToMessage converts the Task model to the required data structure for gRPC transmission
func (i *Task) ConvertToMessage() *taskPackage.Task {
	empId := i.EmployeeId.Hex()
	shiftId := i.ShiftId.Hex()
	mngId := i.ManagerId.Hex()
	return &taskPackage.Task{
		Id:               i.Id,
		Division:         i.Division,
		EmployeeId:       empId,
		ShiftId:          shiftId,
		ManagerId:        mngId,
		AllocatedTimeMin: i.AllocatedTimeMin,
		SpecialRequests:  i.SpecialRequests,
		Completed:        i.Completed,
		RejectionReason:  i.RejectionReason,
	}
}
