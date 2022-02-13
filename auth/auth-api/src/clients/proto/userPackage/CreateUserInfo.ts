// Original file: src/clients/proto/user.proto

import type { UserModel as _userPackage_UserModel, UserModel__Output as _userPackage_UserModel__Output } from '../userPackage/UserModel';

export interface CreateUserInfo {
  'status'?: (number);
  'jwt'?: (string);
  'user'?: (_userPackage_UserModel | null);
}

export interface CreateUserInfo__Output {
  'status': (number);
  'jwt': (string);
  'user': (_userPackage_UserModel__Output | null);
}
