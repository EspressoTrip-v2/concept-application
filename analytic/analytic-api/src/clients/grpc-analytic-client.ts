import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcClient, GrpcServicePorts } from "@espressotrip-org/concept-common";
import { ProtoGrpcType } from "./proto/analytic";


export class GrpcAnalyticClient extends AbstractGrpcClient {
    readonly m_protoPath = __dirname + "/proto/analytic.proto";
    readonly m_port = GrpcServicePorts.AUTH_SERVICE;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.analyticsPackage;

}

export const userGrpcClient = new GrpcAnalyticClient();
