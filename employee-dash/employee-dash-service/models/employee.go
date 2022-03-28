package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// Employee is the data structure used by the task service
type Employee struct {
	Id                 primitive.ObjectID `bson:"_id"`
	Country            string             `bson:"country"`
	Email              string             `bson:"email"`
	Gender             string             `bson:"gender"`
	BranchName         string             `bson:"branchName"`
	LastName           string             `bson:"lastName"`
	Password           string             `bson:"password"`
	Race               string             `bson:"race"`
	Region             string             `bson:"region"`
	RegisteredEmployee bool               `bson:"registeredEmployee"`
	Position           string             `bson:"position"`
	ProviderId         string             `bson:"providerId"`
	ShiftPreference    string             `bson:"shiftPreference"`
	StartDate          time.Time          `bson:"startDate"`
	SignInType         string             `bson:"signInType"`
	UserRole           string             `bson:"userRole"`
	FirstName          string             `bson:"firstName"`
	PhoneNumber        string             `bson:"phoneNumber"`
	Division           string             `bson:"division"`
	Version            int                `bson:"version"`
}


// EmployeePayload is the payload received from the Rabbit publishers
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
	Version            int       `json:"version"`
}
