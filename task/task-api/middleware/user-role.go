package middleware

import (
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/userroles"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	"task-api/models"
)

func UserRole(role userroles.UserRoles) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userClaim, ok := r.Context().Value("currentUser").(*models.JwtUser)
			if userClaim == nil || !ok {
				err := libErrors.NewNotAuthorizedError()
				utils.WriteResponse(w, err.Status, err.GetErrors())
				return
			}
			if userroles.UserRoles(userClaim.UserRole) != role {
				err := libErrors.NewNotAuthorizedError()
				utils.WriteResponse(w, err.Status, err.GetErrors())
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
