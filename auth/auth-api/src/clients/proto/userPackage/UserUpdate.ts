// Original file: src/clients/proto/user.proto


export interface UserUpdate {
  'id'?: (string);
  'name'?: (string);
  'userRole'?: (string);
  'categories'?: (string)[];
  'password'?: (string);
  'providerId'?: (string);
}

export interface UserUpdate__Output {
  'id': (string);
  'name': (string);
  'userRole': (string);
  'categories': (string)[];
  'password': (string);
  'providerId': (string);
}
