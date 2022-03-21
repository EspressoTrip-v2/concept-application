package routes

import (
	"encoding/json"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
)

func CreateShift(w http.ResponseWriter, r *http.Request) {
	var s taskPackage.Shift
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, libErrors.NewBadRequestError("Invalid payload format").GetErrors())
	} else {
		response, err := grpc.GrpcClient().CreateShift(&s)
		if err != nil {
			utils.WriteResponse(w, http.StatusBadRequest, err.GetErrors())
		} else {
			utils.WriteResponse(w, int(response.Status), response)
		}
	}
}
