package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"github.com/gorilla/mux"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
	"task-api/tacer"
)

func GetShift(w http.ResponseWriter, r *http.Request) {
	ctx, span := tacer.GetTracer().Start(r.Context(), "GetShift")
	defer span.End()

	shiftId := mux.Vars(r)["shiftId"]
	shiftRequest := taskPackage.ShiftRequest{
		Id: shiftId,
	}
	response, err := grpc.GrpcClient().GetShift(ctx, &shiftRequest)
	if err != nil {
		utils.WriteResponse(w, err.Status, err.GetErrors())
	} else {
		utils.WriteResponse(w, http.StatusOK, response)
	}
}
