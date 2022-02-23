import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EmployeeServiceClient as _employeePackage_EmployeeServiceClient, EmployeeServiceDefinition as _employeePackage_EmployeeServiceDefinition } from './employeePackage/EmployeeService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  employeePackage: {
    EmployeeId: MessageTypeDefinition
    EmployeeService: SubtypeConstructor<typeof grpc.Client, _employeePackage_EmployeeServiceClient> & { service: _employeePackage_EmployeeServiceDefinition }
    GrpcEmployee: MessageTypeDefinition
    GrpcEmployeeAttributes: MessageTypeDefinition
    GrpcResponsePayload: MessageTypeDefinition
  }
}

