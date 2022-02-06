// Original file: src/proto/user.proto


export interface ServerStreamUserResponse {
  'id'?: (string);
  'name'?: (string);
  'email'?: (string);
  'signInType'?: (string);
  'providerId'?: (string);
  'groups'?: (string)[];
  'userRoles'?: (string)[];
  'password'?: (string);
  'version'?: (number);
}

export interface ServerStreamUserResponse__Output {
  'id': (string);
  'name': (string);
  'email': (string);
  'signInType': (string);
  'providerId': (string);
  'groups': (string)[];
  'userRoles': (string)[];
  'password': (string);
  'version': (number);
}
