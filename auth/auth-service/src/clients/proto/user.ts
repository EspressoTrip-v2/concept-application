import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { UserServiceClient as _userPackage_UserServiceClient, UserServiceDefinition as _userPackage_UserServiceDefinition } from './userPackage/UserService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  userPackage: {
    AllGrpcUsers: MessageTypeDefinition
    CreateGrpcUserInfo: MessageTypeDefinition
    GitHubGrpcUser: MessageTypeDefinition
    GoogleGrpcUser: MessageTypeDefinition
    LocalGrpcUser: MessageTypeDefinition
    ServerStreamUserResponse: MessageTypeDefinition
    UserService: SubtypeConstructor<typeof grpc.Client, _userPackage_UserServiceClient> & { service: _userPackage_UserServiceDefinition }
    grpcUser: MessageTypeDefinition
    grpcUserUpdate: MessageTypeDefinition
  }
}
