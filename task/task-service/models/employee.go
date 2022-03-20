package models

import (
	taskPackage "task-service/proto"
	"time"
)

type EmployeeItem struct {
	Id              string `bson:"_id"`
	Division        string `bson:"division"`
	NumberTasks     int32  `bson:"numberTasks"`
	Email           string `bson:"email"`
	BranchName      string `bson:"branchName"`
	FirstName       string `bson:"firstName"`
	LastName        string `bson:"lastName"`
	Position        string `bson:"position"`
	Country         string `bson:"country"`
	ShiftPreference string `bson:"shiftPreference"`
}

func (e EmployeeItem) ConvertToMessage() *taskPackage.Employee {
	return &taskPackage.Employee{
		Id:              e.Id,
		Division:        e.Division,
		NumberTasks:     e.NumberTasks,
		Email:           e.Email,
		BranchName:      e.BranchName,
		Country:         e.Country,
		Position:        e.Position,
		FirstName:       e.FirstName,
		LastName:        e.LastName,
		ShiftPreference: e.ShiftPreference,
	}
}

type EmployeePayload struct {
	Id                 string    `json:"id"`
	Country            string    `json:"country"`
	Email              string    `json:"email"`
	Gender             string    `json:"gender"`
	BranchName         string    `json:"branchName"`
	LastName           string    `json:"lastName"`
	Password           string    `json:"password"`
	Race               string    `json:"race"`
	Region             string    `json:"region"`
	RegisteredEmployee bool      `json:"registeredEmployee"`
	Position           string    `json:"position"`
	ProviderId         string    `json:"providerId"`
	ShiftPreference    string    `json:"shiftPreference"`
	StartDate          time.Time `json:"startDate"`
	SignInType         string    `json:"signInType"`
	UserRole           string    `json:"userRole"`
	FirstName          string    `json:"firstName"`
	PhoneNumber        string    `json:"phoneNumber"`
	Division           string    `json:"division"`
}
