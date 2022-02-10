// Original file: src/proto/user.proto


export interface ServerStreamUserResponse {
  'id'?: (string);
  'name'?: (string);
  'email'?: (string);
  'signInType'?: (string);
  'providerId'?: (string);
  'categories'?: (string)[];
  'userRole'?: (string);
  'password'?: (string);
  'version'?: (number);
}

export interface ServerStreamUserResponse__Output {
  'id': (string);
  'name': (string);
  'email': (string);
  'signInType': (string);
  'providerId': (string);
  'categories': (string)[];
  'userRole': (string);
  'password': (string);
  'version': (number);
}
