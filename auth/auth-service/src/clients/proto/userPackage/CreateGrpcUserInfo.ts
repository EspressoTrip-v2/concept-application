// Original file: ../../auth/proto/user.proto

import type { grpcUser as _userPackage_grpcUser, grpcUser__Output as _userPackage_grpcUser__Output } from '../userPackage/grpcUser';

export interface CreateGrpcUserInfo {
  'status'?: (number);
  'jwt'?: (string);
  'user'?: (_userPackage_grpcUser | null);
}

export interface CreateGrpcUserInfo__Output {
  'status': (number);
  'jwt': (string);
  'user': (_userPackage_grpcUser__Output | null);
}
