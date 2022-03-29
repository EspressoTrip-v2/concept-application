package grpc

import (
	"context"
	localLogger "employee-dash-service/local-logger"
	"employee-dash-service/models"
	employeePackage "employee-dash-service/proto/employee/proto"
	userPackage "employee-dash-service/proto/user/proto"
	"employee-dash-service/services/mongoclient"
	"employee-dash-service/utils"
	"errors"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/oath"
	"go.mongodb.org/mongo-driver/bson"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type EmployeeDashRpcHandlers struct {
	mongo *mongoclient.MongoClient
}

func (r *EmployeeDashRpcHandlers) GetEmployee(ctx context.Context, id *employeePackage.EmployeeId) (*employeePackage.EmployeeResponsePayload, error) {
	//TODO implement me
	panic("implement me")
}

func (r *EmployeeDashRpcHandlers) LoginGoogleUser(ctx context.Context, user *employeePackage.GoogleGrpcUser) (*employeePackage.GrpcResponsePayload, error) {

	var emp models.Employee
	filter := bson.D{{"email", user.GetEmail()}}
	err := r.mongo.FindOneEmployee(ctx, filter, &emp)
	ok := r.onFailure(err, logcodes.ERROR, "Employee not registered", "employee-dash/employee-dash-service/services/grpc/employee-grpc-handlers.go:31")
	if !ok {
		return nil, status.Errorf(codes.NotFound, fmt.Sprintf("Employee not registered: %v", err.Error()))
	}
	if emp.SignInType == string(oath.UNKNOWN) {
		rs, customError := GrpcClient().LoginGoogleUser(ctx, (*userPackage.GoogleGrpcUser)(user))
		if customError != nil {
			err := errors.New(customError.Message[0])
			r.onFailure(err, logcodes.ERROR, customError.Message[0], "employee-dash/employee-dash-service/services/grpc/employee-grpc-handlers.go:55")
			return nil, status.Errorf(codes.Unknown, customError.Message[0])
		}

		if emp.SignInType != string(oath.GOOGLE) || user.GetSub() != emp.ProviderId {
			err := errors.New("Invalid credentials")
			r.onFailure(err, logcodes.ERROR, "Invalid Google credentials", "employee-dash/employee-dash-service/services/grpc/employee-grpc-handlers.go:41")
			return nil, status.Errorf(codes.PermissionDenied, err.Error())
		}

		if emp.SignInType == string(oath.GITHUB) || emp.SignInType == string(oath.LOCAL) {
			err := errors.New("Not Authorized")
			r.onFailure(err, logcodes.ERROR, "Not Authorized", "employee-dash/employee-dash-service/services/grpc/employee-grpc-handlers.go:47")
			return nil, status.Errorf(codes.PermissionDenied, err.Error())
		}

		response := employeePackage.GrpcResponsePayload{
			Status: rs.Status,
			Jwt:    rs.Jwt,
			Data:   (*employeePackage.GrpcUser)(rs.Data),
		}
		return &response, nil
	}

	// Encode the JWT
	jwt, err := utils.EncodeJwt(&emp)
	ok = r.onFailure(err, logcodes.ERROR, "Unable to encode JWT", "employee-dash/employee-dash-service/services/grpc/employee-grpc-handlers.go:68")
	if !ok {
		return nil, status.Errorf(codes.Internal, fmt.Sprintf("Unable to encode JWT payload"))
	}

	// Create the gRPC user
	grpcUser := employeePackage.GrpcUser{
		Id:                 emp.Id.Hex(),
		FirstName:          emp.FirstName,
		LastName:           emp.LastName,
		Gender:             emp.Gender,
		Race:               emp.Race,
		Position:           emp.Position,
		StartDate:          emp.StartDate.String(),
		ShiftPreference:    emp.ShiftPreference,
		BranchName:         emp.BranchName,
		Region:             emp.Region,
		Country:            emp.Country,
		PhoneNumber:        emp.PhoneNumber,
		Email:              emp.Email,
		Version:            int32(emp.Version),
		SignInType:         emp.SignInType,
		ProviderId:         emp.ProviderId,
		Password:           emp.Password,
		UserRole:           emp.UserRole,
		RegisteredEmployee: emp.Region,
		Division:           emp.Division,
	}
	response := &employeePackage.GrpcResponsePayload{
		Status: 200,
		Jwt:    jwt,
		Data:   &grpcUser,
	}
	return response, nil
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
