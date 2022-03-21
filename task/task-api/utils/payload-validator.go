package utils

import "github.com/go-playground/validator/v10"

var validatorInstance *PayloadValidator

type PayloadValidator struct {
	PayloadValidator *validator.Validate
}

func GetValidator() *PayloadValidator {
	if validatorInstance == nil {
		validatorInstance = &PayloadValidator{PayloadValidator: validator.New()}
		return validatorInstance
	}
	return validatorInstance
}
