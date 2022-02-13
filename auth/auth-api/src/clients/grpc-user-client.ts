import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { AbstractGrpcClient, GrpcServicePorts } from "@espressotrip-org/concept-common";
import { GoogleUser } from "./proto/userPackage/GoogleUser";
import { CreateUserInfo } from "./proto/userPackage/CreateUserInfo";
import { GitHubUser } from "./proto/userPackage/GitHubUser";
import { LocalUser } from "./proto/userPackage/LocalUser";
import { UserModel } from "./proto/userPackage/UserModel";
import { UserUpdate } from "./proto/userPackage/UserUpdate";

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
    updateUser(user: UserUpdate): Promise<grpc.ServiceError | UserModel> {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.UpdateUser(user, (error: grpc.ServiceError | null, updatedUser?: UserModel) => {
                if (error) return reject(error);
                return resolve(updatedUser!);
            });
        });
    }

    /**
     * Save a Google user
     * @param user {GoogleUser}
     */
    saveGoogleUser(user: GoogleUser): Promise<grpc.ServiceError | CreateUserInfo>{
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise(async (resolve, reject) => {
            client.SaveGoogleUser(user, (error: grpc.ServiceError | null, createUserInfo?: CreateUserInfo) => {
                if (error) return reject(error);
                return resolve(createUserInfo!);
            });
        });
    }

    /**
     * Save a GitHub user
     * @param user {GitHubUser}
     */
    saveGitHubUser(user: GitHubUser): Promise<grpc.ServiceError | CreateUserInfo> {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.SaveGitHubUser(user, (error: grpc.ServiceError | null, createUserInfo?: CreateUserInfo) => {
                if (error) return reject(error);
                return resolve(createUserInfo!);
            });
        });
    }

    /**
     * Save a local user
     * @param user {LocalUser}
     */
    saveLocalUser(user: LocalUser): Promise<grpc.ServiceError | CreateUserInfo> {
        const client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
            client.SaveLocalUser(user, (error: grpc.ServiceError | null, createUserInfo?: CreateUserInfo) => {
                if (error) return reject(error);
                return resolve(createUserInfo!);
            });
        });
    }
}

export const userGrpcClient = new GrpcUserClient();
