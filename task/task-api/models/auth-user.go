package models

import (
	"github.com/golang-jwt/jwt"
	"time"
)

type JwtUser struct {
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
	AuthId             string    `json:"authId"`
	UserRole           string    `json:"userRole"`
	FirstName          string    `json:"firstName"`
	PhoneNumber        string    `json:"phoneNumber"`
	Iat                int       `json:"iat"`
	jwt.StandardClaims
}
