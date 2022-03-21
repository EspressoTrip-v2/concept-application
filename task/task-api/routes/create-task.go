package routes

import (
	"encoding/json"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	payloadSchemas "task-api/payload-schemas"
	"task-api/services/grpc"
)

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var ps payloadSchemas.CreateTaskPayload
	jsonErr := json.NewDecoder(r.Body).Decode(&ps)
	ts, payloadError := ps.Validate()

	if jsonErr != nil || payloadError != nil {
		utils.WriteResponse(w, http.StatusBadRequest, libErrors.NewBadRequestError("Invalid payload format").GetErrors())
	} else {
		response, err := grpc.GrpcClient().CreateTask(ts)
		if err != nil {
			utils.WriteResponse(w, http.StatusBadRequest, err.GetErrors())
		} else {
			utils.WriteResponse(w, int(response.Status), response)
		}
	}
}
