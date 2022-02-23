// Original file: src/services/proto/user.proto

import type { grpcUser as _userPackage_grpcUser, grpcUser__Output as _userPackage_grpcUser__Output } from '../userPackage/grpcUser';

export interface GrpcResponsePayload {
  'status'?: (number);
  'jwt'?: (string);
  'data'?: (_userPackage_grpcUser | null);
}

export interface GrpcResponsePayload__Output {
  'status': (number);
  'jwt': (string);
  'data': (_userPackage_grpcUser__Output | null);
}
