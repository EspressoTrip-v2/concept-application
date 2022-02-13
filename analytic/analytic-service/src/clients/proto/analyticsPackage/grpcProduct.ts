// Original file: src/clients/proto/analytic.proto


export interface grpcProduct {
  'quantity'?: (number);
  'reserved'?: (number);
  'category'?: (string);
  'tags'?: (string)[];
  'title'?: (string);
  'price'?: (number);
  'description'?: (string);
  'userId'?: (string);
  'orderId'?: (string);
  'itemCode'?: (string);
}

export interface grpcProduct__Output {
  'quantity': (number);
  'reserved': (number);
  'category': (string);
  'tags': (string)[];
  'title': (string);
  'price': (number);
  'description': (string);
  'userId': (string);
  'orderId': (string);
  'itemCode': (string);
}
