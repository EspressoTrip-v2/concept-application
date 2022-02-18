import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { ServerStreamUserResponse } from "./proto/userPackage/ServerStreamUserResponse";
import { User, UserDoc } from "../models";
import { AbstractGrpcServer, SignInTypes } from "@espressotrip-org/concept-common";
import { generateJwt, Password } from "../utils";
import { grpcUser } from "./proto/userPackage/grpcUser";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { CreateGrpcUserInfo } from "./proto/userPackage/CreateGrpcUserInfo";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";
import { GitHubGrpcUser } from "./proto/userPackage/GitHubGrpcUser";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;

    readonly m_server = new grpc.Server();

    /**
     * Stream all users from database (Used for service initialization)
     * @param call {grpc.ServerWritableStream<grpcUser, ServerStreamUserResponse>}
     */
    async GetAllUsers(call: grpc.ServerWritableStream<grpcUser, ServerStreamUserResponse>): Promise<void> {
        User.find({})
            .cursor()
            .on("data", user => {
                call.write(user);
            })
            .on("end", () => {
                call.end();
            });
    }

    /**
     * gRPC method Google user sign in
     * @param call {grpc.ServerUnaryCall<GoogleGrpcUser, CreateGrpcUserInfo>}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async LoginGoogleUser(call: grpc.ServerUnaryCall<GoogleGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let googleUser: UserDoc | null;
        googleUser = await User.findOne({ email: call.request.email });

        if (!googleUser)
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "User not found.",
            });

        switch (googleUser.signInType) {
            case SignInTypes.GITHUB:
            case SignInTypes.LOCAL:
                return callback({ code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${googleUser.signInType}` });
            case SignInTypes.UNKNOWN:
                googleUser.set({ signInType: SignInTypes.GOOGLE, providerId: call.request.sub });
                await googleUser.save();
                return callback(null, {
                    user: googleUser,
                    jwt: generateJwt(googleUser),
                    status: 200,
                });
            case SignInTypes.GOOGLE:
                if (googleUser.providerId === call.request.sub)
                    return callback(null, {
                        user: googleUser,
                        jwt: generateJwt(googleUser),
                        status: 200,
                    });
                else
                    return callback({
                        code: grpc.status.PERMISSION_DENIED,
                        details: "Invalid credentials",
                    });
            default:
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "User not found",
                });
        }
    }

    /**
     * gRPC method GitHub user sign in
     * @param call {grpc.ServerUnaryCall<GitHubGrpcUser, CreateGrpcUserInfo>}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async LoginGitHubUser(call: grpc.ServerUnaryCall<GitHubGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let gitHubUser: UserDoc | null;
        gitHubUser = await User.findOne({ email: call.request.email });

        if (!gitHubUser)
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "User not found",
            });

        switch (gitHubUser.signInType) {
            case SignInTypes.GOOGLE:
            case SignInTypes.LOCAL:
                return callback({ code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${gitHubUser.signInType}` });
            case SignInTypes.UNKNOWN:
                gitHubUser.set({ signInType: SignInTypes.GITHUB, providerId: call.request.id!.toString() });
                await gitHubUser.save();
                return callback(null, {
                    user: gitHubUser,
                    jwt: generateJwt(gitHubUser),
                    status: 200,
                });
            case SignInTypes.GITHUB:
                if (gitHubUser.providerId === call.request.id!.toString())
                    return callback(null, {
                        user: gitHubUser,
                        jwt: generateJwt(gitHubUser),
                        status: 200,
                    });
                else
                    return callback({
                        code: grpc.status.PERMISSION_DENIED,
                        details: "Invalid credentials",
                    });
            default:
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "User not found",
                });
        }
    }

    /**
     * gRPC method Local sign in or sign up
     * @param call {grpc.ServerUnaryCall<LocalGrpcUser, CreateGrpcUserInfo>,}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async LoginLocalUser(call: grpc.ServerUnaryCall<LocalGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let localUser: UserDoc | null;

        /** See if user exists */
        localUser = await User.findOne({ email: call.request.email });
        if (!localUser)
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "User does not exists.",
            });

        switch (localUser.signInType) {
            case SignInTypes.GOOGLE:
            case SignInTypes.GITHUB:
                return callback({ code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${localUser.signInType}` });
            case SignInTypes.UNKNOWN:
                localUser.set({ signInType: SignInTypes.LOCAL });
                await localUser.save();
                return callback(null, {
                    user: localUser,
                    jwt: generateJwt(localUser),
                    status: 200,
                });
            case SignInTypes.LOCAL:
                if (await Password.compare(localUser.password, call.request.password!))
                    return callback(null, {
                        user: localUser,
                        jwt: generateJwt(localUser),
                        status: 200,
                    });
                else
                    return callback({
                        code: grpc.status.PERMISSION_DENIED,
                        details: "Invalid credentials",
                    });
            default:
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "User not found",
                });
        }
    }

    /**
     * Start the server
     */
    listen(logMessage: string): void {
        this.m_server.addService(this.m_package.UserService.service, {
            GetAllUsers: this.GetAllUsers,
            LoginGoogleUser: this.LoginGoogleUser,
            LoginGitHubUser: this.LoginGitHubUser,
            LoginLocalUser: this.LoginLocalUser,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(logMessage);
            this.m_server.start();
        });
    }
}

export const grpcServer = new GrpcServer();
