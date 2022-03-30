package utils

import (
	"employee-dash-service/models"
	"github.com/golang-jwt/jwt"
	"os"
)

func EncodeJwt(user *models.Employee) (string, error) {
	jwtSecret := []byte(os.Getenv("JWT_KEY"))

	claim := models.EmployeeClaims{
		Id:                 user.UserRole,
		Country:            user.Country,
		Email:              user.Email,
		Gender:             user.Gender,
		BranchName:         user.BranchName,
		LastName:           user.LastName,
		Password:           user.Password,
		Race:               user.Race,
		Region:             user.Region,
		RegisteredEmployee: user.RegisteredEmployee,
		Position:           user.Position,
		ProviderId:         user.ProviderId,
		ShiftPreference:    user.ShiftPreference,
		StartDate:          user.StartDate,
		SignInType:         user.SignInType,
		UserRole:           user.UserRole,
		FirstName:          user.FirstName,
		PhoneNumber:        user.PhoneNumber,
		Division:           user.Division,
		Version:            user.Version,
	}

	// Parse the session token from the payload struct
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	signedString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}
	return signedString, nil

}
