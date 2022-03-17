import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AbstractGrpcClient, GrpcServicePortDns } from "@espressotrip-org/concept-common";
import { ProtoGrpcType } from "./proto/analytic";

export class GrpcAnalyticClient extends AbstractGrpcClient {
    static m_instance: GrpcAnalyticClient | undefined
    readonly m_protoPath = __dirname + "/proto/analytic.proto";
    readonly m_port = GrpcServicePortDns.ANALYTIC_SERVICE_DNS;
    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.analyticsPackage;

    constructor() {
        super();
    }
    // @ts-ignore
    // private m_client: EmployeeServiceClient // TODO: NEED TO ADD THE CORRECT TYPE

    static getClient(): GrpcAnalyticClient {
        if (this.m_instance === undefined) {
            this.m_instance = new GrpcAnalyticClient()
            return this.m_instance
        }
        return this.m_instance
    }

    connect(logMsg: string): void {
    }

    // TODO: NEED TO IMPLEMENT SERVICE RPC CALLS HERE
}

export const userGrpcClient = new GrpcAnalyticClient();
