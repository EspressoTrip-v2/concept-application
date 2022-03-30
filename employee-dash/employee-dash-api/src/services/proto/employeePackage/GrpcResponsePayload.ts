// Original file: proto/employee.proto

import type { GrpcUser as _employeePackage_GrpcUser, GrpcUser__Output as _employeePackage_GrpcUser__Output } from '../employeePackage/GrpcUser';

export interface GrpcResponsePayload {
  'status'?: (number);
  'jwt'?: (string);
  'data'?: (_employeePackage_GrpcUser | null);
}

export interface GrpcResponsePayload__Output {
  'status': (number);
  'jwt': (string);
  'data': (_employeePackage_GrpcUser__Output | null);
}
