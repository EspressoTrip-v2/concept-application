// Original file: proto/user.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GitHubGrpcUser as _userPackage_GitHubGrpcUser, GitHubGrpcUser__Output as _userPackage_GitHubGrpcUser__Output } from '../userPackage/GitHubGrpcUser';
import type { GoogleGrpcUser as _userPackage_GoogleGrpcUser, GoogleGrpcUser__Output as _userPackage_GoogleGrpcUser__Output } from '../userPackage/GoogleGrpcUser';
import type { GrpcResponsePayload as _userPackage_GrpcResponsePayload, GrpcResponsePayload__Output as _userPackage_GrpcResponsePayload__Output } from '../userPackage/GrpcResponsePayload';
import type { LocalGrpcUser as _userPackage_LocalGrpcUser, LocalGrpcUser__Output as _userPackage_LocalGrpcUser__Output } from '../userPackage/LocalGrpcUser';

export interface UserServiceClient extends grpc.Client {
  LoginGitHubUser(argument: _userPackage_GitHubGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGitHubUser(argument: _userPackage_GitHubGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGitHubUser(argument: _userPackage_GitHubGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGitHubUser(argument: _userPackage_GitHubGrpcUser, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _userPackage_GitHubGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _userPackage_GitHubGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _userPackage_GitHubGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _userPackage_GitHubGrpcUser, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  LoginGoogleUser(argument: _userPackage_GoogleGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGoogleUser(argument: _userPackage_GoogleGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGoogleUser(argument: _userPackage_GoogleGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGoogleUser(argument: _userPackage_GoogleGrpcUser, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _userPackage_GoogleGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _userPackage_GoogleGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _userPackage_GoogleGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _userPackage_GoogleGrpcUser, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  LoginLocalUser(argument: _userPackage_LocalGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginLocalUser(argument: _userPackage_LocalGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginLocalUser(argument: _userPackage_LocalGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginLocalUser(argument: _userPackage_LocalGrpcUser, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _userPackage_LocalGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _userPackage_LocalGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _userPackage_LocalGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _userPackage_LocalGrpcUser, callback: grpc.requestCallback<_userPackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
  LoginGitHubUser: grpc.handleUnaryCall<_userPackage_GitHubGrpcUser__Output, _userPackage_GrpcResponsePayload>;
  
  LoginGoogleUser: grpc.handleUnaryCall<_userPackage_GoogleGrpcUser__Output, _userPackage_GrpcResponsePayload>;
  
  LoginLocalUser: grpc.handleUnaryCall<_userPackage_LocalGrpcUser__Output, _userPackage_GrpcResponsePayload>;
  
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
  LoginGitHubUser: MethodDefinition<_userPackage_GitHubGrpcUser, _userPackage_GrpcResponsePayload, _userPackage_GitHubGrpcUser__Output, _userPackage_GrpcResponsePayload__Output>
  LoginGoogleUser: MethodDefinition<_userPackage_GoogleGrpcUser, _userPackage_GrpcResponsePayload, _userPackage_GoogleGrpcUser__Output, _userPackage_GrpcResponsePayload__Output>
  LoginLocalUser: MethodDefinition<_userPackage_LocalGrpcUser, _userPackage_GrpcResponsePayload, _userPackage_LocalGrpcUser__Output, _userPackage_GrpcResponsePayload__Output>
}
