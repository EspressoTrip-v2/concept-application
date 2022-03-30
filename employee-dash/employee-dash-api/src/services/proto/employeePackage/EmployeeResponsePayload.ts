// Original file: proto/employee.proto

import type { Employee as _employeePackage_Employee, Employee__Output as _employeePackage_Employee__Output } from '../employeePackage/Employee';

export interface EmployeeResponsePayload {
  'status'?: (number);
  'data'?: (_employeePackage_Employee | null);
}

export interface EmployeeResponsePayload__Output {
  'status': (number);
  'data': (_employeePackage_Employee__Output | null);
}
