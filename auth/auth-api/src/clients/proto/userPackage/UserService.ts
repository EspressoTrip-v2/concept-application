// Original file: src/clients/proto/user.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AllUsers as _userPackage_AllUsers, AllUsers__Output as _userPackage_AllUsers__Output } from '../userPackage/AllUsers';
import type { CreateUserInfo as _userPackage_CreateUserInfo, CreateUserInfo__Output as _userPackage_CreateUserInfo__Output } from '../userPackage/CreateUserInfo';
import type { GitHubUser as _userPackage_GitHubUser, GitHubUser__Output as _userPackage_GitHubUser__Output } from '../userPackage/GitHubUser';
import type { GoogleUser as _userPackage_GoogleUser, GoogleUser__Output as _userPackage_GoogleUser__Output } from '../userPackage/GoogleUser';
import type { LocalUser as _userPackage_LocalUser, LocalUser__Output as _userPackage_LocalUser__Output } from '../userPackage/LocalUser';
import type { ServerStreamUserResponse as _userPackage_ServerStreamUserResponse, ServerStreamUserResponse__Output as _userPackage_ServerStreamUserResponse__Output } from '../userPackage/ServerStreamUserResponse';
import type { UserModel as _userPackage_UserModel, UserModel__Output as _userPackage_UserModel__Output } from '../userPackage/UserModel';
import type { UserUpdate as _userPackage_UserUpdate, UserUpdate__Output as _userPackage_UserUpdate__Output } from '../userPackage/UserUpdate';

export interface UserServiceClient extends grpc.Client {
  GetAllUsers(argument: _userPackage_AllUsers, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  GetAllUsers(argument: _userPackage_AllUsers, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  getAllUsers(argument: _userPackage_AllUsers, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  getAllUsers(argument: _userPackage_AllUsers, options?: grpc.CallOptions): grpc.ClientReadableStream<_userPackage_ServerStreamUserResponse__Output>;
  
  SaveGitHubUser(argument: _userPackage_GitHubUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveGitHubUser(argument: _userPackage_GitHubUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveGitHubUser(argument: _userPackage_GitHubUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveGitHubUser(argument: _userPackage_GitHubUser, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGitHubUser(argument: _userPackage_GitHubUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGitHubUser(argument: _userPackage_GitHubUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGitHubUser(argument: _userPackage_GitHubUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGitHubUser(argument: _userPackage_GitHubUser, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  
  SaveGoogleUser(argument: _userPackage_GoogleUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveGoogleUser(argument: _userPackage_GoogleUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveGoogleUser(argument: _userPackage_GoogleUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveGoogleUser(argument: _userPackage_GoogleUser, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGoogleUser(argument: _userPackage_GoogleUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGoogleUser(argument: _userPackage_GoogleUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGoogleUser(argument: _userPackage_GoogleUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveGoogleUser(argument: _userPackage_GoogleUser, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  
  SaveLocalUser(argument: _userPackage_LocalUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveLocalUser(argument: _userPackage_LocalUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveLocalUser(argument: _userPackage_LocalUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  SaveLocalUser(argument: _userPackage_LocalUser, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveLocalUser(argument: _userPackage_LocalUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveLocalUser(argument: _userPackage_LocalUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveLocalUser(argument: _userPackage_LocalUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  saveLocalUser(argument: _userPackage_LocalUser, callback: grpc.requestCallback<_userPackage_CreateUserInfo__Output>): grpc.ClientUnaryCall;
  
  UpdateUser(argument: _userPackage_UserUpdate, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _userPackage_UserUpdate, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _userPackage_UserUpdate, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _userPackage_UserUpdate, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _userPackage_UserUpdate, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _userPackage_UserUpdate, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _userPackage_UserUpdate, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _userPackage_UserUpdate, callback: grpc.requestCallback<_userPackage_UserModel__Output>): grpc.ClientUnaryCall;
  
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAllUsers: grpc.handleServerStreamingCall<_userPackage_AllUsers__Output, _userPackage_ServerStreamUserResponse>;
  
  SaveGitHubUser: grpc.handleUnaryCall<_userPackage_GitHubUser__Output, _userPackage_CreateUserInfo>;
  
  SaveGoogleUser: grpc.handleUnaryCall<_userPackage_GoogleUser__Output, _userPackage_CreateUserInfo>;
  
  SaveLocalUser: grpc.handleUnaryCall<_userPackage_LocalUser__Output, _userPackage_CreateUserInfo>;
  
  UpdateUser: grpc.handleUnaryCall<_userPackage_UserUpdate__Output, _userPackage_UserModel>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  GetAllUsers: MethodDefinition<_userPackage_AllUsers, _userPackage_ServerStreamUserResponse, _userPackage_AllUsers__Output, _userPackage_ServerStreamUserResponse__Output>
  SaveGitHubUser: MethodDefinition<_userPackage_GitHubUser, _userPackage_CreateUserInfo, _userPackage_GitHubUser__Output, _userPackage_CreateUserInfo__Output>
  SaveGoogleUser: MethodDefinition<_userPackage_GoogleUser, _userPackage_CreateUserInfo, _userPackage_GoogleUser__Output, _userPackage_CreateUserInfo__Output>
  SaveLocalUser: MethodDefinition<_userPackage_LocalUser, _userPackage_CreateUserInfo, _userPackage_LocalUser__Output, _userPackage_CreateUserInfo__Output>
  UpdateUser: MethodDefinition<_userPackage_UserUpdate, _userPackage_UserModel, _userPackage_UserUpdate__Output, _userPackage_UserModel__Output>
}
