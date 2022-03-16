package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
)

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	response, err := grpc.GrpcClient().GetAllTasks(&taskPackage.AllTaskRequest{})
	if err != nil {
		utils.WriteResponse(w, err.Status, err.GetErrors())
	} else {
		utils.WriteResponse(w, http.StatusOK, response)
	}
}
