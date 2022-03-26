package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"task-api/middleware"
	"task-api/routes"
)

func GetRouter() *mux.Router {
	router := mux.NewRouter()
	// Middleware
	router.Use(middleware.JwtValidation())

	// Employees
	router.HandleFunc("/api/task/employee", routes.GetAllEmployees).Methods(http.MethodGet)
	router.HandleFunc("/api/task/employee/{employeeId}", routes.GetEmployee).Methods(http.MethodGet)

	// Shifts
	router.HandleFunc("/api/task/shift", routes.GetAllShifts).Methods(http.MethodGet)
	router.HandleFunc("/api/task/shift", routes.CreateShift).Methods(http.MethodPost)
	router.HandleFunc("/api/task/shift/{shiftId}", routes.GetShift).Methods(http.MethodGet)
	router.HandleFunc("/api/task/shift", routes.UpdateShift).Methods(http.MethodPatch)

	// Tasks
	router.HandleFunc("/api/task", routes.GetAllTasks).Methods(http.MethodGet)
	router.HandleFunc("/api/task", routes.CreateTask).Methods(http.MethodPost)
	router.HandleFunc("/api/task/{taskId}", routes.GetTask).Methods(http.MethodGet)
	router.HandleFunc("/api/task", routes.UpdateTask).Methods(http.MethodPatch)
	router.HandleFunc("/api/task/{taskId}", routes.DeleteTask).Methods(http.MethodDelete)

	return router
}
