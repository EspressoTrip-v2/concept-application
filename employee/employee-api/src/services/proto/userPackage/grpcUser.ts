// Original file: src/clients/proto/user.proto


export interface grpcUser {
  'id'?: (string);
  'name'?: (string);
  'email'?: (string);
  'signInType'?: (string);
  'userRole'?: (string);
  'providerId'?: (string);
  'categories'?: (string)[];
  'version'?: (number);
}

export interface grpcUser__Output {
  'id': (string);
  'name': (string);
  'email': (string);
  'signInType': (string);
  'userRole': (string);
  'providerId': (string);
  'categories': (string)[];
  'version': (number);
}
