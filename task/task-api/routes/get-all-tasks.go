package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
	"task-api/tacer"
)

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	ctx, span := tacer.GetTracer().Start(r.Context(), "GetAllTasks")
	defer span.End()

	response, err := grpc.GrpcClient().GetAllTasks(ctx, &taskPackage.AllTaskRequest{})
	if err != nil {
		utils.WriteResponse(w, err.Status, err.GetErrors())
	} else {
		utils.WriteResponse(w, http.StatusOK, response)
	}
}
