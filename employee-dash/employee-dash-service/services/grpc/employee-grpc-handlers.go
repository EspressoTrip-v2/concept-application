package grpc

import (
	"context"
	localLogger "employee-dash-service/local-logger"
	employeePackage "employee-dash-service/proto/employee/proto"
	"employee-dash-service/services/mongoclient"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
)

type EmployeeDashRpcHandlers struct {
	mongo *mongoclient.MongoClient
}

func (r *EmployeeDashRpcHandlers) GetEmployee(ctx context.Context, id *employeePackage.EmployeeId) (*employeePackage.EmployeeResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r *EmployeeDashRpcHandlers) LoginGoogleUser(ctx context.Context, user *employeePackage.GoogleGrpcUser) (*employeePackage.GrpcResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r *EmployeeDashRpcHandlers) LoginGitHubUser(ctx context.Context, user *employeePackage.GitHubGrpcUser) (*employeePackage.GrpcResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r *EmployeeDashRpcHandlers) LoginLocalUser(ctx context.Context, user *employeePackage.LocalGrpcUser) (*employeePackage.GrpcResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r *EmployeeDashRpcHandlers) onFailure(err error, logCode logcodes.LogCodes, message string, origin string) bool {
	if err != nil {
		localLogger.Log(logCode, message, origin, err.Error())
		fmt.Printf("[employee-dash-service:gRPC-handlers]: %v -> %v\n", message, err.Error())
		return false
	}
	return true
}
