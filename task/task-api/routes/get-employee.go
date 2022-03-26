package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"github.com/gorilla/mux"
	"net/http"
	taskPackage "task-api/proto"
	"task-api/services/grpc"
	"task-api/tacer"
)

func GetEmployee(w http.ResponseWriter, r *http.Request) {
	ctx, span := tacer.GetTracer().Start(r.Context(), "GetEmployee")
	defer span.End()

	employeeId := mux.Vars(r)["employeeId"]
	employeeRequest := taskPackage.EmployeeRequest{
		Id: employeeId,
	}
	response, err := grpc.GrpcClient().GetEmployee(ctx, &employeeRequest)
	if err != nil {
		utils.WriteResponse(w, err.Status, err.GetErrors())
	} else {
		utils.WriteResponse(w, http.StatusOK, response)
	}
}
