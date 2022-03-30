// Original file: proto/employee.proto

import type {
    GrpcEmployee as _employeePackage_GrpcEmployee,
    GrpcEmployee__Output as _employeePackage_GrpcEmployee__Output,
} from "../employeePackage/GrpcEmployee";

export interface GrpcAllEmployeesResponsePayload {
    status?: number;
    data?: _employeePackage_GrpcEmployee[];
}

export interface GrpcAllEmployeesResponsePayload__Output {
    status: number;
    data: _employeePackage_GrpcEmployee__Output[];
}
