// Original file: src/proto/user.proto


export interface User {
  'id'?: (string);
  'name'?: (string);
  'email'?: (string);
  'gitHubId'?: (string);
  'googleId'?: (string);
  'userRoles'?: (string)[];
  'groups'?: (string)[];
  'version'?: (number);
}

export interface User__Output {
  'id': (string);
  'name': (string);
  'email': (string);
  'gitHubId': (string);
  'googleId': (string);
  'userRoles': (string)[];
  'groups': (string)[];
  'version': (number);
}
