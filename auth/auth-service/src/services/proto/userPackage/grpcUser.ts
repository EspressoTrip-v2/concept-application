// Original file: src/services/proto/user.proto


export interface grpcUser {
  'id'?: (string);
  'firstNAme'?: (string);
  'lastName'?: (string);
  'gender'?: (string);
  'race'?: (string);
  'position'?: (string);
  'startDate'?: (string);
  'shiftPreference'?: (string);
  'branchName'?: (string);
  'region'?: (string);
  'country'?: (string);
  'phoneNumber'?: (string);
  'email'?: (string);
  'version'?: (number);
  'signInType'?: (string);
  'providerId'?: (string);
  'password'?: (string);
  'userRole'?: (string);
}

export interface grpcUser__Output {
  'id': (string);
  'firstNAme': (string);
  'lastName': (string);
  'gender': (string);
  'race': (string);
  'position': (string);
  'startDate': (string);
  'shiftPreference': (string);
  'branchName': (string);
  'region': (string);
  'country': (string);
  'phoneNumber': (string);
  'email': (string);
  'version': (number);
  'signInType': (string);
  'providerId': (string);
  'password': (string);
  'userRole': (string);
}
