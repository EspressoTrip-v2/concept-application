// Original file: src/clients/proto/user.proto


export interface grpcUserUpdate {
  'id'?: (string);
  'name'?: (string);
  'userRole'?: (string);
  'categories'?: (string)[];
  'password'?: (string);
  'providerId'?: (string);
}

export interface grpcUserUpdate__Output {
  'id': (string);
  'name': (string);
  'userRole': (string);
  'categories': (string)[];
  'password': (string);
  'providerId': (string);
}
