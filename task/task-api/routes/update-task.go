package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
)

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	utils.WriteResponse(w, http.StatusOK, Sample{Message: "Success"})
}
