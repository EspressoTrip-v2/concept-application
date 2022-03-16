package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"github.com/gorilla/mux"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
)

func GetTask(w http.ResponseWriter, r *http.Request) {
	taskId := mux.Vars(r)["taskId"]
	taskRequest := taskPackage.TaskRequest{
		Id: taskId,
	}
	response, err := grpc.GrpcClient().GetTask(&taskRequest)
	if err != nil {
		utils.WriteResponse(w, err.Status, err.GetErrors())
	} else {
		utils.WriteResponse(w, http.StatusOK, response)
	}
}
