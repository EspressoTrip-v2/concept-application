// Original file: src/services/proto/employee.proto


export interface GrpcEmployee {
  'id'?: (string);
  'firstName'?: (string);
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

export interface GrpcEmployee__Output {
  'id': (string);
  'firstName': (string);
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
