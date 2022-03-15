package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"task-api/routes"
)

func GetRouter() *mux.Router {
	router := mux.NewRouter()

	// http routes
	router.HandleFunc("/api/task", routes.GetAllTasks).Methods(http.MethodGet)
	router.HandleFunc("/api/task", routes.CreateTask).Methods(http.MethodPost)
	router.HandleFunc("/api/task/{taskId}", routes.GetTask).Methods(http.MethodGet)
	router.HandleFunc("/api/task/{taskId}", routes.UpdateTask).Methods(http.MethodPatch)

	return router
}
