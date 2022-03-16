package routes

import (
	"encoding/json"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
)

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	var task taskPackage.Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, libErrors.NewBadRequestError("Invalid payload format").GetErrors())
	} else {
		response, err := grpc.GrpcClient().UpdateTask(&task)
		if err != nil {
			utils.WriteResponse(w, http.StatusBadRequest, err.GetErrors())
		} else {
			utils.WriteResponse(w, int(response.Status), response)
		}
	}
}
