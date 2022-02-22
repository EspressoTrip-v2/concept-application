// Original file: src/services/proto/employee.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EmployeeId as _employeePackage_EmployeeId, EmployeeId__Output as _employeePackage_EmployeeId__Output } from '../employeePackage/EmployeeId';
import type { GrpcEmployeeAttributes as _employeePackage_GrpcEmployeeAttributes, GrpcEmployeeAttributes__Output as _employeePackage_GrpcEmployeeAttributes__Output } from '../employeePackage/GrpcEmployeeAttributes';
import type { GrpcEmployeeInfo as _employeePackage_GrpcEmployeeInfo, GrpcEmployeeInfo__Output as _employeePackage_GrpcEmployeeInfo__Output } from '../employeePackage/GrpcEmployeeInfo';

export interface EmployeeServiceClient extends grpc.Client {
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  
  DeleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  DeleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  DeleteEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  DeleteEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcEmployeeInfo__Output>): grpc.ClientUnaryCall;
  
}

export interface EmployeeServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateEmployee: grpc.handleUnaryCall<_employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcEmployeeInfo>;
  
  DeleteEmployee: grpc.handleUnaryCall<_employeePackage_EmployeeId__Output, _employeePackage_GrpcEmployeeInfo>;
  
  GetEmployee: grpc.handleUnaryCall<_employeePackage_EmployeeId__Output, _employeePackage_GrpcEmployeeInfo>;
  
  UpdateEmployee: grpc.handleUnaryCall<_employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcEmployeeInfo>;
  
}

export interface EmployeeServiceDefinition extends grpc.ServiceDefinition {
  CreateEmployee: MethodDefinition<_employeePackage_GrpcEmployeeAttributes, _employeePackage_GrpcEmployeeInfo, _employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcEmployeeInfo__Output>
  DeleteEmployee: MethodDefinition<_employeePackage_EmployeeId, _employeePackage_GrpcEmployeeInfo, _employeePackage_EmployeeId__Output, _employeePackage_GrpcEmployeeInfo__Output>
  GetEmployee: MethodDefinition<_employeePackage_EmployeeId, _employeePackage_GrpcEmployeeInfo, _employeePackage_EmployeeId__Output, _employeePackage_GrpcEmployeeInfo__Output>
  UpdateEmployee: MethodDefinition<_employeePackage_GrpcEmployeeAttributes, _employeePackage_GrpcEmployeeInfo, _employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcEmployeeInfo__Output>
}
