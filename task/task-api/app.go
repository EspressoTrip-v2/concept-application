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

	return router
}
