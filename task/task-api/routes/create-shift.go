package routes

import (
	"encoding/json"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	payloadSchemas "task-api/payload-schemas"
	"task-api/services/grpc"
)

func CreateShift(w http.ResponseWriter, r *http.Request) {
	var ps payloadSchemas.CreateShiftPayload
	jsonErr := json.NewDecoder(r.Body).Decode(&ps)
	ts, payloadError := ps.Validate()
	if payloadError != nil {
		utils.WriteResponse(w, http.StatusBadRequest, payloadError)
	} else if jsonErr != nil {
		utils.WriteResponse(w, http.StatusBadRequest, jsonErr)
	} else {
		response, err := grpc.GrpcClient().CreateShift(ts)
		if err != nil {
			utils.WriteResponse(w, http.StatusBadRequest, err.GetErrors())
		} else {
			utils.WriteResponse(w, int(response.Status), response)
		}
	}
}
