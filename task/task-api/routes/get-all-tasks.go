package routes

import (
	"github.com/EspressoTrip-v2/concept-go-common/utils"
	"net/http"
)

type Sample struct {
	Message string `json:"message"`
}

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	utils.WriteResponse(w, http.StatusOK, Sample{Message: "Success"})
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	utils.WriteResponse(w, http.StatusOK, Sample{Message: "Success"})
}

func GetTask(w http.ResponseWriter, r *http.Request) {
	utils.WriteResponse(w, http.StatusOK, Sample{Message: "Success"})
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	utils.WriteResponse(w, http.StatusOK, Sample{Message: "Success"})
}
