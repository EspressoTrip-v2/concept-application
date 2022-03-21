package payloadSchemas

import (
	"fmt"
	taskPackage "task-api/proto"
	"task-api/utils"
)

type CreateTaskPayload struct {
	Division         string `json:"division"`
	EmployeeId       string `json:"employeeId"`
	ShiftId          string `json:"shiftId"`
	ManagerId        string `json:"managerId"`
	AllocatedTimeMin int    `json:"allocatedTimeMin"`
	SpecialRequests  string `json:"specialRequests"`
	Completed        bool   `json:"completed"`
	RejectedReason   string `json:"rejectedReason"`
}

func (c *CreateTaskPayload) Validate() (*taskPackage.Task, error) {
	err := utils.GetValidator().PayloadValidator.Struct(c)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	t := taskPackage.Task{
		Division:         c.Division,
		EmployeeId:       c.EmployeeId,
		ShiftId:          c.ShiftId,
		ManagerId:        c.ManagerId,
		AllocatedTimeMin: int32(c.AllocatedTimeMin),
		SpecialRequests:  c.SpecialRequests,
		Completed:        c.Completed,
		RejectionReason:  c.RejectedReason,
	}
	return &t, nil
}
