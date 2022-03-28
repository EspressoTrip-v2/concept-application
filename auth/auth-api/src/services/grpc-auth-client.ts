import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { AbstractGrpcClient, grpcErrorTranslator, GrpcServicePortDns } from "@espressotrip-org/concept-common";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { GitHubGrpcUser } from "./proto/userPackage/GitHubGrpcUser";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";
import { GrpcResponsePayload } from "./proto/userPackage/GrpcResponsePayload";
import { UserServiceClient } from "./proto/userPackage/UserService";

export class GrpcAuthClient extends AbstractGrpcClient {
    static m_instance: GrpcAuthClient | undefined
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = GrpcServicePortDns.AUTH_SERVICE_DNS;
    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;
    // @ts-ignore
    m_client: UserServiceClient

    constructor() {
        super();
    }

    static getClient(): GrpcAuthClient {
        if (this.m_instance === undefined) {
            this.m_instance = new GrpcAuthClient()
            return this.m_instance
        }
        return this.m_instance
    }

    /**
     * Save a Google user
     * @param user {GoogleGrpcUser}
     */
    loginGoogleUser(user: GoogleGrpcUser): Promise<GrpcResponsePayload> {
        return new Promise(async (resolve, reject) => {
            this.m_client.LoginGoogleUser(user, (error: grpc.ServiceError | null, createUserInfo?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(createUserInfo!);
            });
        });
    }

    /**
     * Save a GitHub user
     * @param user {GitHubGrpcUser}
     */
    loginGitHubUser(user: GitHubGrpcUser): Promise<GrpcResponsePayload> {
        return new Promise((resolve, reject) => {
            this.m_client.LoginGitHubUser(user, (error: grpc.ServiceError | null, createUserInfo?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(createUserInfo!);
            });
        });
    }

    /**
     * Save a local user
     * @param user {LocalGrpcUser}
     */
    loginLocalUser(user: LocalGrpcUser): Promise<GrpcResponsePayload> {
        return new Promise((resolve, reject) => {
            this.m_client.LoginLocalUser(user, (error: grpc.ServiceError | null, createUserInfo?: GrpcResponsePayload) => {
                if (error) return reject(grpcErrorTranslator(error));
                return resolve(createUserInfo!);
            });
        });
    }

    connect(logMsg: string): void {
        this.m_client = new this.m_package.UserService(this.m_port, grpc.credentials.createInsecure());
        console.log(logMsg + "Connected on " + GrpcServicePortDns.AUTH_SERVICE_DNS);
    }

}

