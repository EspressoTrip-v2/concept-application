package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"github.com/gorilla/mux"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
)

func GetShift(w http.ResponseWriter, r *http.Request) {
	shiftId := mux.Vars(r)["shiftId"]
	shiftRequest := taskPackage.ShiftRequest{
		Id: shiftId,
	}
	response, err := grpc.GrpcClient().GetShift(&shiftRequest)
	if err != nil {
		utils.WriteResponse(w, err.Status, err.GetErrors())
	} else {
		utils.WriteResponse(w, http.StatusOK, response)
	}
}
