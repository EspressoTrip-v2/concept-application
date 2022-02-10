// Original file: src/proto/product.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ClientProductsRequest as _productPackage_ClientProductsRequest, ClientProductsRequest__Output as _productPackage_ClientProductsRequest__Output } from '../productPackage/ClientProductsRequest';
import type { ServerStreamProductsResponse as _productPackage_ServerStreamProductsResponse, ServerStreamProductsResponse__Output as _productPackage_ServerStreamProductsResponse__Output } from '../productPackage/ServerStreamProductsResponse';

export interface ProductServiceClient extends grpc.Client {
  GetAllProducts(argument: _productPackage_ClientProductsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_productPackage_ServerStreamProductsResponse__Output>;
  GetAllProducts(argument: _productPackage_ClientProductsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_productPackage_ServerStreamProductsResponse__Output>;
  getAllProducts(argument: _productPackage_ClientProductsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_productPackage_ServerStreamProductsResponse__Output>;
  getAllProducts(argument: _productPackage_ClientProductsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_productPackage_ServerStreamProductsResponse__Output>;
  
}

export interface ProductServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAllProducts: grpc.handleServerStreamingCall<_productPackage_ClientProductsRequest__Output, _productPackage_ServerStreamProductsResponse>;
  
}

export interface ProductServiceDefinition extends grpc.ServiceDefinition {
  GetAllProducts: MethodDefinition<_productPackage_ClientProductsRequest, _productPackage_ServerStreamProductsResponse, _productPackage_ClientProductsRequest__Output, _productPackage_ServerStreamProductsResponse__Output>
}
