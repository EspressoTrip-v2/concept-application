import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "../proto/user";
import { MicroServiceNames, AbstractGrpcClient, GrpcServicePorts } from "@espressotrip-org/concept-common";

export class GrpcUserClient extends AbstractGrpcClient {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = GrpcServicePorts.AUTH;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;

    getAllUsers(): void {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        const stream = client.GetAllUsers({ serviceName: MicroServiceNames.ANALYTIC_SERVICE });

        /** Close the client connection on end stream */
        stream.on("end", () => {
            console.log(`[analytics:gRPC:client]: User data initialized -> gRPC client disconnected.`);
            client.close();
        });
    }
}

export const userGrpcClient = new GrpcUserClient();
