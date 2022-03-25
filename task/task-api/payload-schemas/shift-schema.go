package payloadSchemas

import (
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/go-playground/validator/v10"
	taskPackage "task-api/proto"
	"task-api/utils"
)

type CreateShiftPayload struct {
	Division string `json:"division" validate:"required"`
	Type     string `json:"type" validate:"required"`
	Start    string `json:"start" validate:"required"`
	End      string `json:"end" validate:"required"`
	Name     string `json:"name" validate:"required"`
}

func (c *CreateShiftPayload) Validate() (*taskPackage.Shift, *libErrors.CustomError) {
	err := utils.GetValidator().PayloadValidator.Struct(c)
	if err != nil {
		validationErrors := err.(validator.ValidationErrors)
		return nil, libErrors.NewPayloadValidationError(validationErrors)
	}

	t := taskPackage.Shift{
		Division: c.Division,
		Type:     c.Type,
		Start:    c.Start,
		End:      c.End,
		Name:     c.Name,
	}
	return &t, nil
}
