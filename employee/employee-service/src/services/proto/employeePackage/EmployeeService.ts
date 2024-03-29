// Original file: proto/employee.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AllEmployees as _employeePackage_AllEmployees, AllEmployees__Output as _employeePackage_AllEmployees__Output } from '../employeePackage/AllEmployees';
import type { EmployeeId as _employeePackage_EmployeeId, EmployeeId__Output as _employeePackage_EmployeeId__Output } from '../employeePackage/EmployeeId';
import type { GrpcAllEmployeesResponsePayload as _employeePackage_GrpcAllEmployeesResponsePayload, GrpcAllEmployeesResponsePayload__Output as _employeePackage_GrpcAllEmployeesResponsePayload__Output } from '../employeePackage/GrpcAllEmployeesResponsePayload';
import type { GrpcEmployeeAttributes as _employeePackage_GrpcEmployeeAttributes, GrpcEmployeeAttributes__Output as _employeePackage_GrpcEmployeeAttributes__Output } from '../employeePackage/GrpcEmployeeAttributes';
import type { GrpcResponsePayload as _employeePackage_GrpcResponsePayload, GrpcResponsePayload__Output as _employeePackage_GrpcResponsePayload__Output } from '../employeePackage/GrpcResponsePayload';

export interface EmployeeServiceClient extends grpc.Client {
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  CreateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  createEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  DeleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  DeleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  DeleteEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  DeleteEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  deleteEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  GetAllEmployees(argument: _employeePackage_AllEmployees, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  GetAllEmployees(argument: _employeePackage_AllEmployees, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  GetAllEmployees(argument: _employeePackage_AllEmployees, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  GetAllEmployees(argument: _employeePackage_AllEmployees, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  getAllEmployees(argument: _employeePackage_AllEmployees, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  getAllEmployees(argument: _employeePackage_AllEmployees, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  getAllEmployees(argument: _employeePackage_AllEmployees, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  getAllEmployees(argument: _employeePackage_AllEmployees, callback: grpc.requestCallback<_employeePackage_GrpcAllEmployeesResponsePayload__Output>): grpc.ClientUnaryCall;
  
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  GetEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  getEmployee(argument: _employeePackage_EmployeeId, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  UpdateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, metadata: grpc.Metadata, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, options: grpc.CallOptions, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  updateEmployee(argument: _employeePackage_GrpcEmployeeAttributes, callback: grpc.requestCallback<_employeePackage_GrpcResponsePayload__Output>): grpc.ClientUnaryCall;
  
}

export interface EmployeeServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateEmployee: grpc.handleUnaryCall<_employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcResponsePayload>;
  
  DeleteEmployee: grpc.handleUnaryCall<_employeePackage_EmployeeId__Output, _employeePackage_GrpcResponsePayload>;
  
  GetAllEmployees: grpc.handleUnaryCall<_employeePackage_AllEmployees__Output, _employeePackage_GrpcAllEmployeesResponsePayload>;
  
  GetEmployee: grpc.handleUnaryCall<_employeePackage_EmployeeId__Output, _employeePackage_GrpcResponsePayload>;
  
  UpdateEmployee: grpc.handleUnaryCall<_employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcResponsePayload>;
  
}

export interface EmployeeServiceDefinition extends grpc.ServiceDefinition {
  CreateEmployee: MethodDefinition<_employeePackage_GrpcEmployeeAttributes, _employeePackage_GrpcResponsePayload, _employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcResponsePayload__Output>
  DeleteEmployee: MethodDefinition<_employeePackage_EmployeeId, _employeePackage_GrpcResponsePayload, _employeePackage_EmployeeId__Output, _employeePackage_GrpcResponsePayload__Output>
  GetAllEmployees: MethodDefinition<_employeePackage_AllEmployees, _employeePackage_GrpcAllEmployeesResponsePayload, _employeePackage_AllEmployees__Output, _employeePackage_GrpcAllEmployeesResponsePayload__Output>
  GetEmployee: MethodDefinition<_employeePackage_EmployeeId, _employeePackage_GrpcResponsePayload, _employeePackage_EmployeeId__Output, _employeePackage_GrpcResponsePayload__Output>
  UpdateEmployee: MethodDefinition<_employeePackage_GrpcEmployeeAttributes, _employeePackage_GrpcResponsePayload, _employeePackage_GrpcEmployeeAttributes__Output, _employeePackage_GrpcResponsePayload__Output>
}
