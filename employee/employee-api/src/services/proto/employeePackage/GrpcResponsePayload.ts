// Original file: src/services/proto/employee.proto

import type { GrpcEmployee as _employeePackage_GrpcEmployee, GrpcEmployee__Output as _employeePackage_GrpcEmployee__Output } from '../employeePackage/GrpcEmployee';

export interface GrpcResponsePayload {
  'status'?: (number);
  'data'?: (_employeePackage_GrpcEmployee | null);
}

export interface GrpcResponsePayload__Output {
  'status': (number);
  'data': (_employeePackage_GrpcEmployee__Output | null);
}
