// Original file: src/clients/proto/user.proto


export interface UserModel {
  'id'?: (string);
  'name'?: (string);
  'email'?: (string);
  'signInType'?: (string);
  'userRole'?: (string);
  'providerId'?: (string);
  'categories'?: (string)[];
  'version'?: (number);
}

export interface UserModel__Output {
  'id': (string);
  'name': (string);
  'email': (string);
  'signInType': (string);
  'userRole': (string);
  'providerId': (string);
  'categories': (string)[];
  'version': (number);
}
