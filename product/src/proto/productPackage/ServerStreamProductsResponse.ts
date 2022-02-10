// Original file: src/proto/product.proto


export interface ServerStreamProductsResponse {
  'id'?: (string);
  'quantity'?: (number);
  'category'?: (string)[];
  'tags'?: (string)[];
  'title'?: (string);
  'price'?: (number);
  'description'?: (string);
  'orderId'?: (string);
  'userId'?: (string);
  'itemCode'?: (string);
  'version'?: (number);
}

export interface ServerStreamProductsResponse__Output {
  'id': (string);
  'quantity': (number);
  'category': (string)[];
  'tags': (string)[];
  'title': (string);
  'price': (number);
  'description': (string);
  'orderId': (string);
  'userId': (string);
  'itemCode': (string);
  'version': (number);
}
