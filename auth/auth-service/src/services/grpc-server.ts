import * as grpc from "@grpc/grpc-js";
import { ServerWritableStream } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { User, UserDoc } from "../models";
import { AbstractGrpcServer, LogCodes, SignInTypes } from "@espressotrip-org/concept-common";
import { generateJwt, LocalLogger, Password } from "../utils";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";
import { GitHubGrpcUser } from "./proto/userPackage/GitHubGrpcUser";
import { UserServiceHandlers } from "./proto/userPackage/UserService";
import { AllGrpcUsers } from "./proto/userPackage/AllGrpcUsers";
import amqp from "amqplib";
import { GrpcResponsePayload } from "./proto/userPackage/GrpcResponsePayload";
import { UpdateEmployeePublisher } from "../events";
import { GrpcUser } from "./proto/userPackage/GrpcUser";

export class GrpcServer extends AbstractGrpcServer {
    readonly m_protoPath = __dirname + "/proto/user.proto";
    readonly m_port = process.env.GRPC_SERVER_PORT!;

    readonly m_packageDefinition = protoLoader.loadSync(this.m_protoPath, { defaults: true, longs: String, enums: String, keepCase: true });
    readonly m_grpcObject = grpc.loadPackageDefinition(this.m_packageDefinition) as unknown as ProtoGrpcType;
    readonly m_package = this.m_grpcObject.userPackage;

    readonly m_server = new grpc.Server();

    private m_rpcMethods: UserServiceHandlers = {
        GetAllUsers: async (call: ServerWritableStream<AllGrpcUsers, GrpcUser>) => {
            User.find({})
                .cursor()
                .on("data", user => {
                    call.write(user);
                })
                .on("end", () => {
                    call.end();
                });
        },
        LoginGoogleUser: async (call: grpc.ServerUnaryCall<GoogleGrpcUser, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            try {
                let googleUser: UserDoc | null;
                let serverError: Partial<grpc.StatusObject>;
                googleUser = await User.findOne({ email: call.request.email });

                if (!googleUser) {
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "Sign-in user not found.",
                    };
                    LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginGoogleUser", `email: ${call.request.email}`);
                    return callback(serverError);
                }

                switch (googleUser.signInType) {
                    case SignInTypes.GITHUB:
                    case SignInTypes.LOCAL:
                        serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${googleUser.signInType} account` };
                        LocalLogger.log(
                            LogCodes.ERROR,
                            serverError.details!,
                            "LoginGoogleUser",
                            `email: ${call.request.email}, account: ${googleUser.signInType}`,
                        );
                        return callback(serverError);
                    case SignInTypes.UNKNOWN:
                        googleUser.set({ signInType: SignInTypes.GOOGLE, providerId: call.request.sub });
                        await googleUser.save();
                        if (googleUser.registeredEmployee) new UpdateEmployeePublisher(this.m_rabbitConnection!).publish(User.convertToGrpcMessage(googleUser));
                        LocalLogger.log(
                            LogCodes.UPDATED,
                            "Sign-in user registered",
                            "LoginGoogleUser",
                            `email: ${call.request.email},  UserId: ${googleUser.id}`,
                        );

                        return callback(null, {
                            data: googleUser as unknown as GrpcUser,
                            jwt: generateJwt(googleUser),
                            status: 200,
                        });
                    case SignInTypes.GOOGLE:
                        if (googleUser.providerId === call.request.sub)
                            return callback(null, {
                                data: googleUser as unknown as GrpcUser,
                                jwt: generateJwt(googleUser),
                                status: 200,
                            });
                        else {
                            serverError = {
                                code: grpc.status.PERMISSION_DENIED,
                                details: "Invalid credentials",
                            };
                            LocalLogger.log(
                                LogCodes.ERROR,
                                serverError.details!,
                                "LoginGoogleUser",
                                `email: ${call.request.email},  UserId: ${call.request.sub}`,
                            );

                            return callback(serverError);
                        }
                    default:
                        serverError = {
                            code: grpc.status.NOT_FOUND,
                            details: "User not found",
                        };
                        LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginGoogleUser", `email: ${call.request.email}`);
                        callback(serverError);
                }
            } catch (error) {
                const serverError = {
                    code: grpc.status.INTERNAL,
                    details: `Google login error: ${(error as Error).message}`,
                };
                LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginGoogleUser", `Unknown server error.`);
                return callback(serverError);
            }
        },
        LoginGitHubUser: async (
            call: grpc.ServerUnaryCall<GitHubGrpcUser, GrpcResponsePayload>,
            callback: grpc.sendUnaryData<GrpcResponsePayload>,
        ): Promise<void> => {
            try {
                let gitHubUser: UserDoc | null;
                let serverError: Partial<grpc.StatusObject>;
                gitHubUser = await User.findOne({ email: call.request.email });

                if (!gitHubUser) {
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "User not found",
                    };
                    LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `email: ${call.request.email}`);

                    return callback(serverError);
                }
                switch (gitHubUser.signInType) {
                    case SignInTypes.GOOGLE:
                    case SignInTypes.LOCAL:
                        serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${gitHubUser.signInType} account` };
                        LocalLogger.log(
                            LogCodes.ERROR,
                            serverError.details!,
                            "LoginGitHubUser",
                            `email: ${call.request.email}, account: ${gitHubUser.signInType}`,
                        );

                        return callback(serverError);
                    case SignInTypes.UNKNOWN:
                        gitHubUser.set({ signInType: SignInTypes.GITHUB, providerId: call.request.id!.toString() });
                        await gitHubUser.save();
                        if (gitHubUser.registeredEmployee) new UpdateEmployeePublisher(this.m_rabbitConnection!).publish(User.convertToGrpcMessage(gitHubUser));
                        LocalLogger.log(
                            LogCodes.UPDATED,
                            "Sign-in user registered",
                            "LoginGitHubUser",
                            `email: ${gitHubUser.email},  UserId:  ${gitHubUser.id}`,
                        );

                        return callback(null, {
                            data: gitHubUser as unknown as GrpcUser,
                            jwt: generateJwt(gitHubUser),
                            status: 200,
                        });
                    case SignInTypes.GITHUB:
                        if (gitHubUser.providerId === call.request.id!.toString())
                            return callback(null, {
                                data: gitHubUser as unknown as GrpcUser,
                                jwt: generateJwt(gitHubUser),
                                status: 200,
                            });
                        else {
                            serverError = {
                                code: grpc.status.PERMISSION_DENIED,
                                details: "Invalid credentials",
                            };
                            LocalLogger.log(
                                LogCodes.ERROR,
                                serverError.details!,
                                "LoginGitHubUser",
                                `email: ${call.request.email},  UserId: ${call.request.id}`,
                            );

                            return callback(serverError);
                        }
                    default:
                        serverError = {
                            code: grpc.status.NOT_FOUND,
                            details: "User not found",
                        };
                        LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `email: ${call.request.email}`);

                        callback(serverError);
                }
            } catch (error) {
                const serverError = {
                    code: grpc.status.INTERNAL,
                    details: `GitHub login error: ${(error as Error).message}`,
                };
                LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginGitHubUser", `Unknown server error`);
                return callback(serverError);
            }
        },
        LoginLocalUser: async (call: grpc.ServerUnaryCall<LocalGrpcUser, GrpcResponsePayload>, callback: grpc.sendUnaryData<GrpcResponsePayload>) => {
            try {
                let localUser: UserDoc | null;
                let serverError: Partial<grpc.StatusObject>;

                /** See if user exists */
                localUser = await User.findOne({ email: call.request.email });
                if (!localUser) {
                    serverError = {
                        code: grpc.status.NOT_FOUND,
                        details: "User does not exists.",
                    };
                    LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginLocalUser", `email: ${call.request.email}`);

                    return callback(serverError);
                }

                switch (localUser.signInType) {
                    case SignInTypes.GOOGLE:
                    case SignInTypes.GITHUB:
                        serverError = { code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${localUser.signInType} account` };
                        LocalLogger.log(
                            LogCodes.ERROR,
                            serverError.details!,
                            "LoginLocalUser",
                            `email: ${call.request.email}, account: ${localUser.signInType}`,
                        );

                        return callback(serverError);
                    case SignInTypes.UNKNOWN:
                        localUser.set({ signInType: SignInTypes.LOCAL });
                        await localUser.save();
                        if (localUser.registeredEmployee) new UpdateEmployeePublisher(this.m_rabbitConnection!).publish(User.convertToGrpcMessage(localUser));
                        LocalLogger.log(
                            LogCodes.UPDATED,
                            "Sign-in user registered",
                            "LoginLocalUser",
                            `email: ${call.request.email}, UserId: ${localUser.id}`,
                        );

                        return callback(null, {
                            data: localUser as unknown as GrpcUser,
                            jwt: generateJwt(localUser),
                            status: 200,
                        });
                    case SignInTypes.LOCAL:
                        if (await Password.compare(localUser.password, call.request.password!))
                            return callback(null, {
                                data: localUser as unknown as GrpcUser,
                                jwt: generateJwt(localUser),
                                status: 200,
                            });
                        else {
                            serverError = {
                                code: grpc.status.PERMISSION_DENIED,
                                details: "Invalid credentials",
                            };
                            LocalLogger.log(
                                LogCodes.ERROR,
                                serverError.details!,
                                "LoginLocalUser",
                                `email: ${call.request.email}, password: ${call.request.password}`,
                            );

                            return callback(serverError);
                        }
                    default:
                        serverError = {
                            code: grpc.status.NOT_FOUND,
                            details: "Undefined error",
                        };
                        LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginLocalUser", "Undefined error");

                        callback(serverError);
                }
            } catch (error) {
                const serverError = {
                    code: grpc.status.INTERNAL,
                    details: `Local login error: ${(error as Error).message}`,
                };
                LocalLogger.log(LogCodes.ERROR, serverError.details!, "LoginLocalUser", `Unknown server error.`);
                return callback(serverError);
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
