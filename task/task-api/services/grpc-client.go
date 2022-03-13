package services

import (
	"github.com/EspressoTrip-v2/concept-go-common/grpcPorts"
)

var grpcClient *GrpcClient

type GrpcClient struct {
	port grpcPorts.GrpcServicePortDns
}

func GetGrpcClient() *GrpcClient {
	if grpcClient == nil {
		grpcClient = &GrpcClient{grpcPorts.TASK_SERVICE_DNS}
		return grpcClient
	}
	return grpcClient
}

// add rpc handler calls
