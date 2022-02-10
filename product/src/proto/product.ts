import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ProductServiceClient as _productPackage_ProductServiceClient, ProductServiceDefinition as _productPackage_ProductServiceDefinition } from './productPackage/ProductService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  productPackage: {
    ClientProductsRequest: MessageTypeDefinition
    ProductService: SubtypeConstructor<typeof grpc.Client, _productPackage_ProductServiceClient> & { service: _productPackage_ProductServiceDefinition }
    ServerStreamProductsResponse: MessageTypeDefinition
  }
}

