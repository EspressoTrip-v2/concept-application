// Original file: src/proto/analytic.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ClientAnalyticsRequest as _analyticsPackage_ClientAnalyticsRequest, ClientAnalyticsRequest__Output as _analyticsPackage_ClientAnalyticsRequest__Output } from '../analyticsPackage/ClientAnalyticsRequest';
import type { ServerStreamAnalyticsResponse as _analyticsPackage_ServerStreamAnalyticsResponse, ServerStreamAnalyticsResponse__Output as _analyticsPackage_ServerStreamAnalyticsResponse__Output } from '../analyticsPackage/ServerStreamAnalyticsResponse';

export interface AnalyticsServiceClient extends grpc.Client {
  GetAnalytics(argument: _analyticsPackage_ClientAnalyticsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_analyticsPackage_ServerStreamAnalyticsResponse__Output>;
  GetAnalytics(argument: _analyticsPackage_ClientAnalyticsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_analyticsPackage_ServerStreamAnalyticsResponse__Output>;
  getAnalytics(argument: _analyticsPackage_ClientAnalyticsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_analyticsPackage_ServerStreamAnalyticsResponse__Output>;
  getAnalytics(argument: _analyticsPackage_ClientAnalyticsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_analyticsPackage_ServerStreamAnalyticsResponse__Output>;
  
}

export interface AnalyticsServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAnalytics: grpc.handleServerStreamingCall<_analyticsPackage_ClientAnalyticsRequest__Output, _analyticsPackage_ServerStreamAnalyticsResponse>;
  
}

export interface AnalyticsServiceDefinition extends grpc.ServiceDefinition {
  GetAnalytics: MethodDefinition<_analyticsPackage_ClientAnalyticsRequest, _analyticsPackage_ServerStreamAnalyticsResponse, _analyticsPackage_ClientAnalyticsRequest__Output, _analyticsPackage_ServerStreamAnalyticsResponse__Output>
}
