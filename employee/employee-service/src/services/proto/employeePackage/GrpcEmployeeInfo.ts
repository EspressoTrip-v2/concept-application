// Original file: src/services/proto/employee.proto

import type { GrpcEmployee as _employeePackage_GrpcEmployee, GrpcEmployee__Output as _employeePackage_GrpcEmployee__Output } from '../employeePackage/GrpcEmployee';

export interface GrpcEmployeeInfo {
  'status'?: (number);
  'user'?: (_employeePackage_GrpcEmployee | null);
}

export interface GrpcEmployeeInfo__Output {
  'status': (number);
  'user': (_employeePackage_GrpcEmployee__Output | null);
}
