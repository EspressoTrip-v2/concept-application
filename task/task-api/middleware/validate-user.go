package middleware

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"github.com/golang-jwt/jwt"
	"net/http"
	"os"
	localLogger "task-api/local-logger"
	"task-api/models"
)

func decodeJWT(cookie *http.Cookie) (*models.JwtUser, *libErrors.CustomError) {
	jwtSecret := os.Getenv("JWT_KEY")
	value := cookie.Value

	// Express cookie session is stored in a base64 string
	dst := make([]byte, base64.StdEncoding.DecodedLen(len(value)))
	n, err := base64.StdEncoding.Decode(dst, []byte(value))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Invalid encryption on session", "task/task-api/middleware/jwt-validation.go:26", err.Error())
		return nil, libErrors.NewNotAuthorizedError()
	}
	dst = dst[:n]

	// Un-marshal the json into the JwtPayload struct
	var payload models.JwtPayload
	err = json.Unmarshal(dst, &payload)
	if err != nil {
		localLogger.Log(logcodes.ERROR, "Un-marshaling of session payload failed", "task/task-api/middleware/jwt-validation.go:35", err.Error())
		return nil, libErrors.NewPayloadEncryptionError()
	}
	// Parse the session token from the payload struct
	token, err := jwt.ParseWithClaims(payload.PayLoad, &models.JwtUser{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})
	claims, ok := token.Claims.(*models.JwtUser)
	if token.Valid && ok {
		return claims, nil
	} else {
		return nil, libErrors.NewNotAuthorizedError()
	}
}

func ValidateUser() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("session")
			if err != nil {
				utils.WriteResponse(w, http.StatusUnauthorized, libErrors.NewNotAuthorizedError())
				return
			}
			claim, decodeErr := decodeJWT(cookie)
			if decodeErr == nil && claim != nil {
				ctx := context.WithValue(r.Context(), "currentUser", claim)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				utils.WriteResponse(w, http.StatusUnauthorized, decodeErr.GetErrors())
			}
		})
	}
}
