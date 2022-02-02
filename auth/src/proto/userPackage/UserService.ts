// Original file: src/proto/user.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ClientUsersRequest as _userPackage_ClientUsersRequest, ClientUsersRequest__Output as _userPackage_ClientUsersRequest__Output } from '../userPackage/ClientUsersRequest';
import type { ServerStreamUserResponse as _userPackage_ServerStreamUserResponse, ServerStreamUserResponse__Output as _userPackage_ServerStreamUserResponse__Output } from '../userPackage/ServerStreamUserResponse';

export interface UserServiceClient extends grpc.Client {
  GetAllUsers(argument: _userPackage_ClientUsersRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  GetAllUsers(argument: _userPackage_ClientUsersRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  getAllUsers(argument: _userPackage_ClientUsersRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  getAllUsers(argument: _userPackage_ClientUsersRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAllUsers: grpc.handleServerStreamingCall<_userPackage_ClientUsersRequest__Output, _userPackage_ServerStreamUserResponse>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  GetAllUsers: MethodDefinition<_userPackage_ClientUsersRequest, _userPackage_ServerStreamUserResponse, _userPackage_ClientUsersRequest__Output, _userPackage_ServerStreamUserResponse__Output>
}
