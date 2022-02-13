import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { AbstractGrpcClient, GrpcServicePorts } from "@espressotrip-org/concept-common";
import { grpcUserUpdate } from "./proto/userPackage/grpcUserUpdate";
import { grpcUser } from "./proto/userPackage/grpcUser";
import { CreateGrpcUserInfo } from "./proto/userPackage/CreateGrpcUserInfo";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { GitHubGrpcUser } from "./proto/userPackage/GitHubGrpcUser";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";


export class GrpcUserClient extends AbstractGrpcClient {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = GrpcServicePorts.AUTH_SERVICE;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;
    /**
     * Update a user
     * @param user {UpdateUser}
     */
    updateUser(user: grpcUserUpdate): Promise<grpc.ServiceError | grpcUser> {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.UpdateUser(user, (error: grpc.ServiceError | null, updatedUser?: grpcUser) => {
                if (error) return reject(error);
                return resolve(updatedUser!);
            });
        });
    }

    /**
     * Save a Google user
     * @param user {GoogleUser}
     */
    saveGoogleUser(user: GoogleGrpcUser): Promise<grpc.ServiceError | CreateGrpcUserInfo>{
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.SaveGoogleUser(user, (error: grpc.ServiceError | null, createUserInfo?: CreateGrpcUserInfo) => {
                if (error) return reject(error);
                return resolve(createUserInfo!);
            });
        });
    }

    /**
     * Save a GitHub user
     * @param user {GitHubUser}
     */
    saveGitHubUser(user: GitHubGrpcUser): Promise<grpc.ServiceError | CreateGrpcUserInfo> {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.SaveGitHubUser(user, (error: grpc.ServiceError | null, createUserInfo?: CreateGrpcUserInfo) => {
                if (error) return reject(error);
                return resolve(createUserInfo!);
            });
        });
    }

    /**
     * Save a local user
     * @param user {LocalUser}
     */
    saveLocalUser(user: LocalGrpcUser): Promise<grpc.ServiceError | CreateGrpcUserInfo> {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.SaveLocalUser(user, (error: grpc.ServiceError | null, createUserInfo?: CreateGrpcUserInfo) => {
                if (error) return reject(error);
                return resolve(createUserInfo!);
            });
        });
    }
}

export const userGrpcClient = new GrpcUserClient();
