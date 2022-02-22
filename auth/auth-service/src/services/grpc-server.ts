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

    private m_logger = LogPublisher.getPublisher(this.m_rabbitConnection!, MicroServiceNames.AUTH_SERVICE, "auth-service:gRPC-server");
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
                    details: "Sign-in user not found.",
                };
                this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGoogleUser", `email: ${call.request.email}`);
                return callback(serverError);
            }

            switch (googleUser.signInType) {
                case SignInTypes.GITHUB:
                case SignInTypes.LOCAL:
                    serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${googleUser.signInType} account` };
                    this.m_logger.publish(
                        LogCodes.ERROR,
                        serverError.details!,
                        "LoginGoogleUser",
                        `email: ${call.request.email}, account: ${googleUser.signInType}`
                    );
                    return callback(serverError);
                case SignInTypes.UNKNOWN:
                    googleUser.set({ signInType: SignInTypes.GOOGLE, providerId: call.request.sub });
                    await googleUser.save().catch(error => {
                        if (error) {
                            serverError = {
                                code: grpc.status.INTERNAL,
                                details: "Could not update Google user signInType, user save failed",
                            };
                            this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGoogleUser", `email: ${googleUser?.email}`);
                            return callback(serverError);
                        }
                    });
                    this.m_logger.publish(LogCodes.UPDATED, "Sign-in user registered", "LoginGoogleUser", `email: ${call.request.email},  id: ${googleUser.id}`);

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
                        this.m_logger.publish(
                            LogCodes.ERROR,
                            serverError.details!,
                            "LoginGoogleUser",
                            `email: ${call.request.email},  id: ${call.request.sub}`
                        );

                        return callback(serverError);
                    }
                default:
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "User not found",
                    };
                    this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGoogleUser", `email: ${call.request.email}`);
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
                this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `email: ${call.request.email}`);

                return callback(serverError);
            }
            switch (gitHubUser.signInType) {
                case SignInTypes.GOOGLE:
                case SignInTypes.LOCAL:
                    serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${gitHubUser.signInType} account` };
                    this.m_logger.publish(
                        LogCodes.ERROR,
                        serverError.details!,
                        "LoginGitHubUser",
                        `email: ${call.request.email}, account: ${gitHubUser.signInType}`
                    );

                    return callback(serverError);
                case SignInTypes.UNKNOWN:
                    gitHubUser.set({ signInType: SignInTypes.GITHUB, providerId: call.request.id!.toString() });
                    await gitHubUser.save().catch(error => {
                        if (error) {
                            serverError = {
                                code: grpc.status.INTERNAL,
                                details: "Could not update GitHub user signInType, user save failed",
                            };
                            this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `email: ${gitHubUser?.email}`);
                            return callback(serverError);
                        }
                    });
                    this.m_logger.publish(LogCodes.UPDATED, "Sign-in user registered", "LoginGitHubUser", `email: ${gitHubUser.email},  id:  ${gitHubUser.id}`);

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
                        this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `email: ${call.request.email},  id: ${call.request.id}`);

                        return callback(serverError);
                    }
                default:
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "User not found",
                    };
                    this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `email: ${call.request.email}`);

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
                this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginLocalUser", `email: ${call.request.email}`);

                return callback(serverError);
            }

            switch (localUser.signInType) {
                case SignInTypes.GOOGLE:
                case SignInTypes.GITHUB:
                    serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${localUser.signInType} account` };
                    this.m_logger.publish(
                        LogCodes.ERROR,
                        serverError.details!,
                        "LoginLocalUser",
                        `email: ${call.request.email}, account: ${localUser.signInType}`
                    );

                    return callback(serverError);
                case SignInTypes.UNKNOWN:
                    localUser.set({ signInType: SignInTypes.LOCAL });
                    await localUser.save().catch(error => {
                        if (error) {
                            serverError = {
                                code: grpc.status.INTERNAL,
                                details: "Could not update Local user signInType, user save failed",
                            };
                            this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginLocalUser", `email: ${localUser?.email}`);
                            return callback(serverError);
                        }
                    });
                    this.m_logger.publish(LogCodes.UPDATED, "Sign-in user registered", "LoginLocalUser", `email: ${call.request.email}, id: ${localUser.id}`);

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
                        this.m_logger.publish(
                            LogCodes.ERROR,
                            serverError.details!,
                            "LoginLocalUser",
                            `email: ${call.request.email}, password: ${call.request.password}`
                        );

                        return callback(serverError);
                    }
                default:
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "Undefined error",
                    };
                    this.m_logger.publish(LogCodes.ERROR, serverError.details!, "LoginLocalUser", "Undefined error");

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
