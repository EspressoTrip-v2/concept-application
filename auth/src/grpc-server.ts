import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { ClientUsersRequest } from "./proto/userPackage/ClientUsersRequest";
import { ServerStreamUserResponse } from "./proto/userPackage/ServerStreamUserResponse";
import { User } from "./models";
import { AbstractGrpcServer } from "@espressotrip-org/concept-common/build/grpc";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = process.env.GRPC_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;

    readonly m_server = new grpc.Server();

    async GetAllUsers(call: grpc.ServerWritableStream<ClientUsersRequest, ServerStreamUserResponse>): Promise<void> {
        User.find({})
            .cursor()
            .on("data", user => {
                call.write(user);
            })
            .on("end", () => {
                call.end();
            });
    }

    listen(): void {
        this.m_server.addService(this.m_package.UserService.service, {
            GetAllUsers: this.GetAllUsers,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(`[auth:gRPC]: Listening port 50051`);
            this.m_server.start();
        });
    }
}

export const grpcServer = new GrpcServer();
