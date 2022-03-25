package payloadSchemas

import (
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/go-playground/validator/v10"
	taskPackage "task-api/proto"
	"task-api/utils"
)

type CreateTaskPayload struct {
	Division         string `json:"division" validate:"required"`
	EmployeeId       string `json:"employeeId" validate:"required"`
	ShiftId          string `json:"shiftId" validate:"required"`
	ManagerId        string `json:"managerId" validate:"required"`
	AllocatedTimeMin int    `json:"allocatedTimeMin" validate:"required,min=1"`
	SpecialRequests  string `json:"specialRequests" validate:"required"`
	Completed        string `json:"completed" validate:"required,oneof=yes no"`
	RejectedReason   string `json:"rejectedReason" validate:"required"`
	Name             string `json:"name" validate:"required"`
	Description      string `json:"description" validate:"required"`
}

func (c *CreateTaskPayload) Validate() (*taskPackage.Task, *libErrors.CustomError) {
	err := utils.GetValidator().PayloadValidator.Struct(c)
	if err != nil {
		validationErrors := err.(validator.ValidationErrors)
		return nil, libErrors.NewPayloadValidationError(validationErrors)
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
		Name:             c.Name,
		Description:      c.Description,
	}
	return &t, nil
}
