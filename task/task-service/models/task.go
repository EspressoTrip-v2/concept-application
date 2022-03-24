package models

import taskPackage "task-service/proto"

// Task is the task data structure used by the task service
type Task struct {
	Id               string `bson:"_id,omitempty"`
	Division         string `bson:"division"`
	EmployeeId       string `bson:"employeeId"`
	ShiftId          string `bson:"shiftId"`
	ManagerId        string `bson:"managerId"`
	AllocatedTimeMin int32  `bson:"allocatedTimeMin"`
	SpecialRequests  string `bson:"specialRequests"`
	Completed        string `bson:"completed"`
	RejectionReason  string `bson:"rejectionReason"`
}

// ConvertToMessage converts the Task model to the required data structure for gRPC transmission
func (i *Task) ConvertToMessage() *taskPackage.Task {
	return &taskPackage.Task{
		Id:               i.Id,
		Division:         i.Division,
		EmployeeId:       i.EmployeeId,
		ShiftId:          i.ShiftId,
		ManagerId:        i.ManagerId,
		AllocatedTimeMin: i.AllocatedTimeMin,
		SpecialRequests:  i.SpecialRequests,
		Completed:        i.Completed,
		RejectionReason:  i.RejectionReason,
	}
}
