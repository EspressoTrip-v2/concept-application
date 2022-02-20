import * as grpc from "@grpc/grpc-js";
import { ServerWritableStream } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { User, UserDoc } from "../models";
import { AbstractGrpcServer, LogCodes, LogPublisher, MicroServiceNames, SignInTypes } from "@espressotrip-org/concept-common";
import { generateJwt, Password } from "../utils";
import { grpcUser } from "./proto/userPackage/grpcUser";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { CreateGrpcUserInfo } from "./proto/userPackage/CreateGrpcUserInfo";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";
import { GitHubGrpcUser } from "./proto/userPackage/GitHubGrpcUser";
import { UserServiceHandlers } from "./proto/userPackage/UserService";
import { AllGrpcUsers } from "./proto/userPackage/AllGrpcUsers";
import amqp from "amqplib";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;

    readonly m_server = new grpc.Server();

    private m_logger = LogPublisher.getPublisher(this.m_rabbitConnection!, "auth-service:gRPC-server");
    private m_rpcMethods: UserServiceHandlers = {
        GetAllUsers: async (call: ServerWritableStream<AllGrpcUsers, grpcUser>) => {
            User.find({})
                .cursor()
                .on("data", user => {
                    call.write(user);
                })
                .on("end", () => {
                    call.end();
                });
        },
        LoginGoogleUser: async (call: grpc.ServerUnaryCall<GoogleGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>) => {
            let googleUser: UserDoc | null;
            let serverError: Partial<grpc.StatusObject>;
            googleUser = await User.findOne({ email: call.request.email });

            if (!googleUser) {
                serverError = {
                    code: grpc.status.NOT_FOUND,
                    details: "User not found.",
                };
                this.m_logger.publish({
                    service: MicroServiceNames.AUTH_SERVICE,
                    logContext: LogCodes.ERROR,
                    message: serverError.details,
                    origin: "LoginGoogleUser",
                    details: `email: ${call.request.email}`,
                    date: new Date().toISOString(),
                });
                return callback(serverError);
            }

            switch (googleUser.signInType) {
                case SignInTypes.GITHUB:
                case SignInTypes.LOCAL:
                    serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${googleUser.signInType} account` };
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.ERROR,
                        message: serverError.details,
                        details: `email: ${call.request.email}, account: ${googleUser.signInType}`,
                        origin: "LoginGoogleUser",
                        date: new Date().toISOString(),
                    });
                    return callback(serverError);
                case SignInTypes.UNKNOWN:
                    googleUser.set({ signInType: SignInTypes.GOOGLE, providerId: call.request.sub });
                    await googleUser.save();
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.UPDATED,
                        message: "User registered",
                        details: `email: ${call.request.email},  id: ${googleUser.id}`,
                        date: new Date().toISOString(),
                        origin: "LoginGoogleUser",
                    });
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
                    else {
                        serverError = {
                            code: grpc.status.PERMISSION_DENIED,
                            details: "Invalid credentials",
                        };
                        this.m_logger.publish({
                            service: MicroServiceNames.AUTH_SERVICE,
                            logContext: LogCodes.ERROR,
                            message: serverError.details,
                            origin: "LoginGoogleUser",
                            details: `email: ${call.request.email},  id: ${call.request.sub}`,
                            date: new Date().toISOString(),
                        });
                        return callback(serverError);
                    }
                default:
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "User not found",
                    };
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.ERROR,
                        message: serverError.details,
                        origin: "LoginGoogleUser",
                        details: `email: ${call.request.email}`,
                        date: new Date().toISOString(),
                    });
                    callback(serverError);
            }
        },
        LoginGitHubUser: async (
            call: grpc.ServerUnaryCall<GitHubGrpcUser, CreateGrpcUserInfo>,
            callback: grpc.sendUnaryData<CreateGrpcUserInfo>
        ): Promise<void> => {
            let gitHubUser: UserDoc | null;
            let serverError: Partial<grpc.StatusObject>;
            gitHubUser = await User.findOne({ email: call.request.email });

            if (!gitHubUser) {
                serverError = {
                    code: grpc.status.NOT_FOUND,
                    details: "User not found",
                };
                this.m_logger.publish({
                    service: MicroServiceNames.AUTH_SERVICE,
                    logContext: LogCodes.ERROR,
                    message: serverError.details,
                    origin: "LoginGitHubUser",
                    details: `email: ${call.request.email}`,
                    date: new Date().toISOString(),
                });
                return callback(serverError);
            }
            switch (gitHubUser.signInType) {
                case SignInTypes.GOOGLE:
                case SignInTypes.LOCAL:
                    serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${gitHubUser.signInType} account` };
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.ERROR,
                        message: serverError.details,
                        origin: "LoginGitHubUser",
                        details: `email: ${call.request.email}, account: ${gitHubUser.signInType}`,
                        date: new Date().toISOString(),
                    });
                    return callback(serverError);
                case SignInTypes.UNKNOWN:
                    gitHubUser.set({ signInType: SignInTypes.GITHUB, providerId: call.request.id!.toString() });
                    await gitHubUser.save();
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.UPDATED,
                        message: "User registered",
                        details: `email: ${gitHubUser.email},  id:  ${gitHubUser.id}`,
                        date: new Date().toISOString(),
                        origin: "LoginGitHubUser",
                    });
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
                    else {
                        serverError = {
                            code: grpc.status.PERMISSION_DENIED,
                            details: "Invalid credentials",
                        };
                        this.m_logger.publish({
                            service: MicroServiceNames.AUTH_SERVICE,
                            logContext: LogCodes.ERROR,
                            message: serverError.details,
                            origin: "LoginGitHubUser",
                            details: `email: ${call.request.email},  id: ${call.request.id}`,
                            date: new Date().toISOString(),
                        });
                        return callback(serverError);
                    }
                default:
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "User not found",
                    };
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.ERROR,
                        message: serverError.details,
                        origin: "LoginGitHubUser",
                        details: `email: ${call.request.email}`,
                        date: new Date().toISOString(),
                    });
                    callback(serverError);
            }
        },
        LoginLocalUser: async (call: grpc.ServerUnaryCall<LocalGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>) => {
            let localUser: UserDoc | null;
            let serverError: Partial<grpc.StatusObject>;

            /** See if user exists */
            localUser = await User.findOne({ email: call.request.email });
            if (!localUser) {
                serverError = {
                    code: grpc.status.NOT_FOUND,
                    details: "User does not exists.",
                };
                this.m_logger.publish({
                    service: MicroServiceNames.AUTH_SERVICE,
                    logContext: LogCodes.ERROR,
                    message: serverError.details,
                    origin: "LoginLocalUser",
                    details: `email: ${call.request.email}`,
                    date: new Date().toISOString(),
                });
                return callback(serverError);
            }

            switch (localUser.signInType) {
                case SignInTypes.GOOGLE:
                case SignInTypes.GITHUB:
                    serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${localUser.signInType} account` };
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.ERROR,
                        message: serverError.details,
                        origin: "LoginLocalUser",
                        details: `email: ${call.request.email}, account: ${localUser.signInType}`,
                        date: new Date().toISOString(),
                    });
                    return callback(serverError);
                case SignInTypes.UNKNOWN:
                    localUser.set({ signInType: SignInTypes.LOCAL });
                    await localUser.save();
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.UPDATED,
                        message: "User registered",
                        details: `email: ${call.request.email}, id: ${localUser.id}`,
                        date: new Date().toISOString(),
                        origin: "LoginLocalUser",
                    });
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
                    else {
                        serverError = {
                            code: grpc.status.PERMISSION_DENIED,
                            details: "Invalid credentials",
                        };
                        this.m_logger.publish({
                            service: MicroServiceNames.AUTH_SERVICE,
                            logContext: LogCodes.ERROR,
                            message: serverError.details,
                            origin: "LoginLocalUser",
                            details: `email: ${call.request.email}, password: ${call.request.password}`,
                            date: new Date().toISOString(),
                        });
                        return callback(serverError);
                    }
                default:
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "Undefined error",
                    };
                    this.m_logger.publish({
                        service: MicroServiceNames.AUTH_SERVICE,
                        logContext: LogCodes.ERROR,
                        message: serverError.details,
                        origin: "LoginLocalUser",
                        details: "Undefined error",
                        date: new Date().toISOString(),
                    });
                    callback(serverError);
            }
        },
    };

    constructor(rabbitConnection: amqp.Connection) {
        super(rabbitConnection);
    }

    /**
     * Start the server
     */
    listen(logMessage: string): GrpcServer {
        this.m_server.addService(this.m_package.UserService.service, {
            GetAllUsers: this.m_rpcMethods.GetAllUsers,
            LoginGoogleUser: this.m_rpcMethods.LoginGoogleUser,
            LoginGitHubUser: this.m_rpcMethods.LoginGitHubUser,
            LoginLocalUser: this.m_rpcMethods.LoginLocalUser,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(logMessage);
            this.m_server.start();
        });
        return this;
    }
}

/**
 * Constructs gRPC server with Rabbit client for logging
 * @param rabbitConnection
 */
export const grpcServer = (rabbitConnection: amqp.Connection): GrpcServer => new GrpcServer(rabbitConnection);
