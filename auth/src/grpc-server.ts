import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/user";
import { UserServiceHandlers } from "./proto/userPackage/UserService";
import { ClientUsersRequest } from "./proto/userPackage/ClientUsersRequest";
import { ServerStreamUserResponse } from "./proto/userPackage/ServerStreamUserResponse";
import { User } from "./models";

const PROTO_PATH = "./proto/user.proto";
const PORT = process.env.GRPC_PORT!;

/** Load definition */
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { defaults: true, longs: String, enums: String, keepCase: true });

/** Dynamically create the package from the proto file */
const grpcObject = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
const userPackage = grpcObject.userPackage;

/** Create the RPC methods */
const rpcMethods: UserServiceHandlers = {
    async GetAllUsers(call: grpc.ServerWritableStream<ClientUsersRequest, ServerStreamUserResponse>): Promise<void> {
        // Get 1000 user at a time and stream the data to the request
        await User.find() // TODO: COMPLETE THIS
    },
};

// Finish the server connection
