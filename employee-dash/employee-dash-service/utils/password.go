package utils

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string, salt int) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), salt)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func ComparePassword(hashedPassword string, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return err
	}
	return nil
}
