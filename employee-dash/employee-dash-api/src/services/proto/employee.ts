import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EmployeeServiceClient as _employeePackage_EmployeeServiceClient, EmployeeServiceDefinition as _employeePackage_EmployeeServiceDefinition } from './employeePackage/EmployeeService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  employeePackage: {
    Employee: MessageTypeDefinition
    EmployeeId: MessageTypeDefinition
    EmployeeResponsePayload: MessageTypeDefinition
    EmployeeService: SubtypeConstructor<typeof grpc.Client, _employeePackage_EmployeeServiceClient> & { service: _employeePackage_EmployeeServiceDefinition }
    EmployeeUpdate: MessageTypeDefinition
    GitHubGrpcUser: MessageTypeDefinition
    GoogleGrpcUser: MessageTypeDefinition
    GrpcResponsePayload: MessageTypeDefinition
    GrpcUser: MessageTypeDefinition
    LocalGrpcUser: MessageTypeDefinition
  }
}

