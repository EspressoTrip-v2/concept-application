import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { ServerStreamUserResponse } from "./proto/userPackage/ServerStreamUserResponse";
import { User, UserDoc } from "../models";
import { AbstractGrpcServer, rabbitClient, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { UpdateUserPublisher } from "../events/publishers";
import { generateJwt, Password } from "../services";
import { grpcUser } from "./proto/userPackage/grpcUser";
import { GoogleGrpcUser } from "./proto/userPackage/GoogleGrpcUser";
import { CreateGrpcUserInfo } from "./proto/userPackage/CreateGrpcUserInfo";
import { LocalGrpcUser } from "./proto/userPackage/LocalGrpcUser";
import { grpcUserUpdate } from "./proto/userPackage/grpcUserUpdate";
import { GitHubGrpcUser } from "./proto/userPackage/GitHubGrpcUser";

// ------------------------------------------------------------------------------------------
/* The below validations are not 100% secure, but they are only intended for functionality */
// ------------------------------------------------------------------------------------------

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
     * @param call {GoogleGrpcUser}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async LoginGoogleUser(call: grpc.ServerUnaryCall<GoogleGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let googleUser: UserDoc | null;

        /** See if user exists */
        googleUser = await User.findOne({ email: call.request.email });
        if (googleUser && googleUser.signInType !== SignInTypes.GOOGLE)
            return callback({ code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${googleUser.signInType}` });

        if (!googleUser)
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "User does not exists.",
            });

        /** Add the Google id if the is none, newly created user */
        if (googleUser && !googleUser.providerId && !googleUser.password) googleUser.providerId = call.request.sub!;

        /** Create the info object */
        const createUserInfo: CreateGrpcUserInfo = {
            user: googleUser,
            jwt: generateJwt(googleUser),
            status: 201,
        };
        return callback(null, createUserInfo);
    }

    /**
     * gRPC method GitHub user sign in
     * @param call {GitHubGrpcUser}
     * @param callback {grpc.sendUnaryData<CreateGrpcUserInfo>}
     */
    async LoginGitHubUser(call: grpc.ServerUnaryCall<GitHubGrpcUser, CreateGrpcUserInfo>, callback: grpc.sendUnaryData<CreateGrpcUserInfo>): Promise<void> {
        let gitHubUser: UserDoc | null;

        /** See if user exists */
        gitHubUser = await User.findOne({ email: call.request.email });
        if (gitHubUser && gitHubUser.signInType !== SignInTypes.GITHUB)
            return callback({ code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${gitHubUser.signInType}` });

        if (!gitHubUser)
            return callback({
                code: grpc.status.NOT_FOUND,
                details: "User does not exists.",
            });

        /** Add the GitHub id if the is none, newly created user */
        if (gitHubUser && !gitHubUser.providerId && !gitHubUser.password) gitHubUser.providerId = call.request.id!.toString();

        /** Create the info object */
        const createUserInfo: CreateGrpcUserInfo = {
            user: gitHubUser,
            jwt: generateJwt(gitHubUser),
            status: 200,
        };
        return callback(null, createUserInfo);
    }

    /**
     * gRPC method Local sign in or sign up
     * @param call
     * @param callback
     * @constructor
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

        if (localUser && localUser.signInType !== SignInTypes.LOCAL)
            return callback({ code: grpc.status.ALREADY_EXISTS, details: `Please sign in with your ${localUser.signInType}` });

        if (localUser && !(await Password.compare(localUser.password, call.request.password!)))
            return callback({
                code: grpc.status.PERMISSION_DENIED,
                details: "Invalid credentials",
            });

        /** Create the info object */
        const createUserInfo: CreateGrpcUserInfo = {
            user: localUser,
            jwt: generateJwt(localUser),
            status: 200,
        };
        return callback(null, createUserInfo);
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
    listen(logMessage: string): void {
        this.m_server.addService(this.m_package.UserService.service, {
            GetAllUsers: this.GetAllUsers,
            LoginGoogleUser: this.LoginGoogleUser,
            LoginGitHubUser: this.LoginGitHubUser,
            LoginLocalUser: this.LoginLocalUser,
            UpdateUser: this.UpdateUser,
        });

        this.m_server.bindAsync(this.m_port, grpc.ServerCredentials.createInsecure(), (error: Error | null, port: number) => {
            if (error) throw new Error(error.message);
            console.log(logMessage);
            this.m_server.start();
        });
    }
}

export const grpcServer = new GrpcServer();
