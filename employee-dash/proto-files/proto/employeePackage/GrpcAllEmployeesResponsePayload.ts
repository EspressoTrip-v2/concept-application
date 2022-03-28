// Original file: proto/employee.proto

import type { Employee as _employeePackage_Employee, Employee__Output as _employeePackage_Employee__Output } from '../employeePackage/Employee';

export interface GrpcAllEmployeesResponsePayload {
  'status'?: (number);
  'data'?: (_employeePackage_Employee)[];
}

export interface GrpcAllEmployeesResponsePayload__Output {
  'status': (number);
  'data': (_employeePackage_Employee__Output)[];
}
