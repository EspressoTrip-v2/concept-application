package grpc

import (
	"context"
	localLogger "employee-dash-service/local-logger"
	userPackage "employee-dash-service/proto/user/proto"
	"fmt"
	"github.com/EspressoTrip-v2/concept-go-common/grpcsevices/grpcports"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var grpcClient *GrpcClientInstance

type GrpcClientInstance struct {
	port       grpcports.GrpcServicePortDns
	client     userPackage.UserServiceClient
	connection *grpc.ClientConn
}

func (c *GrpcClientInstance) LoginGoogleUser(ctx context.Context, user *userPackage.GoogleGrpcUser) (*userPackage.GrpcResponsePayload, *libErrors.CustomError) {
	googleUser, err := c.client.LoginGoogleUser(ctx, user)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return googleUser, nil
}

func (c *GrpcClientInstance) LoginGitHubUser(ctx context.Context, user *userPackage.GitHubGrpcUser) (*userPackage.GrpcResponsePayload, *libErrors.CustomError) {
	gitHubUser, err := c.client.LoginGitHubUser(ctx, user)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return gitHubUser, nil
}

func (c *GrpcClientInstance) LoginLocalUser(ctx context.Context, user *userPackage.LocalGrpcUser) (*userPackage.GrpcResponsePayload, *libErrors.CustomError) {
	gitHubUser, err := c.client.LoginLocalUser(ctx, user)
	if err != nil {
		return nil, libErrors.GrpcTranslator(err)
	}
	return gitHubUser, nil
}

func GrpcClient() *GrpcClientInstance {
	if grpcClient == nil {
		grpcClient = &GrpcClientInstance{grpcports.AUTH_SERVICE_DNS, nil, nil}
		return grpcClient
	}
	return grpcClient
}
func (c *GrpcClientInstance) Connect(msg string) {
	var err error

	c.connection, err = grpc.Dial(string(c.port), grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithUnaryInterceptor(otelgrpc.UnaryClientInterceptor()),
		grpc.WithStreamInterceptor(otelgrpc.StreamClientInterceptor()))
	if err != nil {
		localLogger.Log(logcodes.ERROR, "gRPC client failed to connect to server", "task/task-api/services/grpc-user-client.go:36", err.Error())
	} else {
		fmt.Println(msg)
	}
	client := userPackage.NewUserServiceClient(c.connection)
	c.client = client
}

func (c *GrpcClientInstance) Close() {
	c.connection.Close()
}
