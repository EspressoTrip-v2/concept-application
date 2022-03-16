package models

import taskPackage "task-service/proto"

type TaskItem struct {
	Id               string `bson:"_id,omitempty"`
	Division         string `bson:"division"`
	EmployeeId       string `bson:"EmployeeId"`
	ShiftId          string `bson:"shiftId"`
	ManagerId        string `bson:"managerId"`
	AllocatedTimeMin int32  `bson:"allocatedTimeMin"`
	SpecialRequests  string `bson:"specialRequests"`
	Completed        bool   `bson:"completed"`
	RejectionReason  string `bson:"rejectionReason"`
}

func (i *TaskItem) ConvertToMessage() *taskPackage.Task {
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
