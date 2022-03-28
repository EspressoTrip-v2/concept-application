// Original file: proto/employee.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EmployeeId as _employeePackage_EmployeeId, EmployeeId__Output as _employeePackage_EmployeeId__Output } from '../employeePackage/EmployeeId';
import type { EmployeeResponsePayload as _employeePackage_EmployeeResponsePayload, EmployeeResponsePayload__Output as _employeePackage_EmployeeResponsePayload__Output } from '../employeePackage/EmployeeResponsePayload';

export interface EmployeeServiceClient extends grpc.Client {
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_EmployeeResponsePayload__Output>): grpc.ClientUnaryCall;
  
}

export interface EmployeeServiceHandlers extends grpc.UntypedServiceImplementation {
  GetEmployee: grpc.handleUnaryCall<_employeePackage_EmployeeId__Output, _employeePackage_EmployeeResponsePayload>;
  
}

export interface EmployeeServiceDefinition extends grpc.ServiceDefinition {
  GetEmployee: MethodDefinition<_employeePackage_EmployeeId, _employeePackage_EmployeeResponsePayload, _employeePackage_EmployeeId__Output, _employeePackage_EmployeeResponsePayload__Output>
}
