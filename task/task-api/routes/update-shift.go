package routes

import (
	"encoding/json"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
	"task-api/tacer"
)

func UpdateShift(w http.ResponseWriter, r *http.Request) {
	ctx, span := tacer.GetTracer().Start(r.Context(), "UpdateShift")
	defer span.End()

	var s taskPackage.Shift
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		utils.WriteResponse(w, http.StatusBadRequest, libErrors.NewBadRequestError("Invalid payload format").GetErrors())
	} else {
		response, err := grpc.GrpcClient().UpdateShift(ctx, &s)
		if err != nil {
			utils.WriteResponse(w, http.StatusBadRequest, err.GetErrors())
		} else {
			utils.WriteResponse(w, int(response.Status), response)
		}
	}
}
