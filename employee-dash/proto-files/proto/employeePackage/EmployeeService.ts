// Original file: proto/employee.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EmployeeId as _employeePackage_EmployeeId, EmployeeId__Output as _employeePackage_EmployeeId__Output } from '../employeePackage/EmployeeId';
import type { EmployeeResponsePayload as _employeePackage_EmployeeResponsePayload, EmployeeResponsePayload__Output as _employeePackage_EmployeeResponsePayload__Output } from '../employeePackage/EmployeeResponsePayload';
import type { GitHubGrpcUser as _employeePackage_GitHubGrpcUser, GitHubGrpcUser__Output as _employeePackage_GitHubGrpcUser__Output } from '../employeePackage/GitHubGrpcUser';
import type { GoogleGrpcUser as _employeePackage_GoogleGrpcUser, GoogleGrpcUser__Output as _employeePackage_GoogleGrpcUser__Output } from '../employeePackage/GoogleGrpcUser';
import type { GrpcResponsePayload as _employeePackage_GrpcResponsePayload, GrpcResponsePayload__Output as _employeePackage_GrpcResponsePayload__Output } from '../employeePackage/GrpcResponsePayload';
import type { LocalGrpcUser as _employeePackage_LocalGrpcUser, LocalGrpcUser__Output as _employeePackage_LocalGrpcUser__Output } from '../employeePackage/LocalGrpcUser';

export interface EmployeeServiceClient extends grpc.Client {
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  
  LoginGitHubUser(argument: _employeePackage_GitHubGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGitHubUser(argument: _employeePackage_GitHubGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGitHubUser(argument: _employeePackage_GitHubGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGitHubUser(argument: _employeePackage_GitHubGrpcUser, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _employeePackage_GitHubGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _employeePackage_GitHubGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _employeePackage_GitHubGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGitHubUser(argument: _employeePackage_GitHubGrpcUser, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  LoginGoogleUser(argument: _employeePackage_GoogleGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGoogleUser(argument: _employeePackage_GoogleGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGoogleUser(argument: _employeePackage_GoogleGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginGoogleUser(argument: _employeePackage_GoogleGrpcUser, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _employeePackage_GoogleGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _employeePackage_GoogleGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _employeePackage_GoogleGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginGoogleUser(argument: _employeePackage_GoogleGrpcUser, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  LoginLocalUser(argument: _employeePackage_LocalGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginLocalUser(argument: _employeePackage_LocalGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginLocalUser(argument: _employeePackage_LocalGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  LoginLocalUser(argument: _employeePackage_LocalGrpcUser, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _employeePackage_LocalGrpcUser, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _employeePackage_LocalGrpcUser, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _employeePackage_LocalGrpcUser, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  loginLocalUser(argument: _employeePackage_LocalGrpcUser, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
}

export interface EmployeeServiceHandlers extends grpc.UntypedServiceImplementation {
  GetEmployee: grpc.handleUnaryCall<_employeePackage_EmployeeId__Output, _employeePackage_EmployeeResponsePayload>;
  
  LoginGitHubUser: grpc.handleUnaryCall<_employeePackage_GitHubGrpcUser__Output, _employeePackage_GrpcResponsePayload>;
  
  LoginGoogleUser: grpc.handleUnaryCall<_employeePackage_GoogleGrpcUser__Output, _employeePackage_GrpcResponsePayload>;
  
  LoginLocalUser: grpc.handleUnaryCall<_employeePackage_LocalGrpcUser__Output, _employeePackage_GrpcResponsePayload>;
  
}

export interface EmployeeServiceDefinition extends grpc.ServiceDefinition {
  GetEmployee: MethodDefinition<_employeePackage_EmployeeId, _employeePackage_EmployeeResponsePayload, _employeePackage_EmployeeId__Output, _employeePackage_EmployeeResponsePayload__Output>
  LoginGitHubUser: MethodDefinition<_employeePackage_GitHubGrpcUser, _employeePackage_GrpcResponsePayload, _employeePackage_GitHubGrpcUser__Output, _employeePackage_GrpcResponsePayload__Output>
  LoginGoogleUser: MethodDefinition<_employeePackage_GoogleGrpcUser, _employeePackage_GrpcResponsePayload, _employeePackage_GoogleGrpcUser__Output, _employeePackage_GrpcResponsePayload__Output>
  LoginLocalUser: MethodDefinition<_employeePackage_LocalGrpcUser, _employeePackage_GrpcResponsePayload, _employeePackage_LocalGrpcUser__Output, _employeePackage_GrpcResponsePayload__Output>
}
