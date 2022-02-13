import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { ServerStreamUserResponse } from "./proto/userPackage/ServerStreamUserResponse";
import { User, UserDoc } from "../models";
import { AbstractGrpcServer} from "@espressotrip-org/concept-common";
import { SignInTypes } from "@espressotrip-org/concept-common";
import { CreateUserPublisher, UpdateUserPublisher } from "../events/publishers";
import { rabbitClient } from "./rabbitmq-client";
import { generateJwt } from "../services";
import { Password } from "../services";
import { grpcUser } from "./proto/userPackage/grpcUser";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { CreateGrpcUserInfo } from "./proto/userPackage/CreateGrpcUserInfo";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";
import { grpcUserUpdate } from "./proto/userPackage/grpcUserUpdate";
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
     * @param call {grpc.ServerWritableStream<ClientUsersRequest, ServerStreamUserResponse>}
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
     * gRPC method Google user sign in or sign up
     * @param call {GoogleGrpcUser}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async SaveGoogleUser(call: grpc.ServerUnaryCall<GoogleGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let googleUser: UserDoc | null;

        /** See if user exists */
        googleUser = await User.findOne({ email: call.request.email });
        if (googleUser && googleUser.signInType !== SignInTypes.GOOGLE)
            return callback({ code: grpc.status.ALREADY_EXISTS, details: "User already exists with different sign in type" });

        if (!googleUser) {
            googleUser = await User.build(User.buildUserFromGoogle(call.request));
            await googleUser.save();
            /** Publish a create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(googleUser);
        }

        /** Create the info object */
        const createUserInfo: CreateGrpcUserInfo = {
            user: googleUser,
            jwt: generateJwt(googleUser),
            status: 201,
        };
        return callback(null, createUserInfo);
    }

    /**
     * gRPC method GitHub user sign in or sign up
     * @param call {GitHubGrpcUser}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async SaveGitHubUser(call: grpc.ServerUnaryCall<GitHubGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let gitHubUser: UserDoc | null;

        /** See if user exists */
        gitHubUser = await User.findOne({ email: call.request.email });
        if (gitHubUser && gitHubUser.signInType !== SignInTypes.GITHUB)
            return callback({ code: grpc.status.ALREADY_EXISTS, details: "User already exists with different sign in type" });

        if (!gitHubUser) {
            gitHubUser = await User.build(User.buildUserFromGitHub(call.request));
            await gitHubUser.save();
            /** Publish a create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(gitHubUser);
        }

        /** Create the info object */
        const createUserInfo: CreateGrpcUserInfo = {
            user: gitHubUser,
            jwt: generateJwt(gitHubUser),
            status: 201,
        };
        return callback(null, createUserInfo);
    }

    /**
     * gRPC method Local sign in or sign up
     * @param call
     * @param callback
     * @constructor
     */
    async SaveLocalUser(call: grpc.ServerUnaryCall<LocalGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let localUser: UserDoc | null;

        /** See if user exists */
        localUser = await User.findOne({ email: call.request.email });
        if (localUser && localUser.signInType !== SignInTypes.LOCAL)
            return callback({ code: grpc.status.ALREADY_EXISTS, details: "User already exists with different sign in type" });

        if (localUser && !(await Password.compare(localUser.password, call.request.password!)))
            return callback({
                code: grpc.status.PERMISSION_DENIED,
                details: "Invalid credentials",
            });

        if (!localUser && call.request.type) {
            localUser = await User.build(User.buildUserFromLocal(call.request));
            await localUser.save();
            /** Publish a create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(localUser);

            /** Create the info object */
            const createUserInfo: CreateGrpcUserInfo = {
                user: localUser,
                jwt: generateJwt(localUser),
                status: 201,
            };

            return callback(null, createUserInfo);
        }

        if (localUser && !call.request.type) {
            /** Create the info object */
            const createUserInfo: CreateGrpcUserInfo = {
                user: localUser,
                jwt: generateJwt(localUser),
                status: 201,
            };
            return callback(null, createUserInfo);
        }

        return callback({ code: grpc.status.UNKNOWN, details: "Unknown local user type" });
    }

    /**
     * Update existing user
     * @param call {grpc.ServerUnaryCall<grpcUserUpdate, grpcUser>}
     * @param callback {grpc.sendUnaryData<UpdateUser>}
     */
    async UpdateUser(call: grpc.ServerUnaryCall<grpcUserUpdate, grpcUser>, callback: grpc.sendUnaryData<grpcUserUpdate>): Promise<void> {
        const userUpdate: grpcUserUpdate = call.request;
        const user = await User.findById(call.request.id);
        if (!user)
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "User not found",
            });
        user.set(userUpdate);
        await user.save();
        /** Publish an update user event */
        await new UpdateUserPublisher(rabbitClient.connection).publish(user);

        return callback(null, user);
    }

    /**
     * Start the server
     */
    listen(): void {
        this.m_server.addService(this.m_package.UserService.service, {
            GetAllUsers: this.GetAllUsers,
            SaveGoogleUser: this.SaveGoogleUser,
            SaveGitHubUser: this.SaveGitHubUser,
            SaveLocalUser: this.SaveLocalUser,
            UpdateUser: this.UpdateUser,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(`[auth-service:gRPC-server]: Listening on ${port}`);
            this.m_server.start();
        });
    }
}

export const grpcServer = new GrpcServer();
