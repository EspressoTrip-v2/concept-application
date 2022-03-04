// Original file: ../../analytic/proto/analytic.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type { Empty as _analyticsPackage_Empty, Empty__Output as _analyticsPackage_Empty__Output } from "../analyticsPackage/Empty";
import type {
    grpcProductAnalysis as _analyticsPackage_grpcProductAnalysis,
    grpcProductAnalysis__Output as _analyticsPackage_grpcProductAnalysis__Output,
} from "../analyticsPackage/grpcProductAnalysis";

export interface AnalyticServiceClient extends grpc.Client {
    GetProductAnalysis(argument: _analyticsPackage_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    GetProductAnalysis(argument: _analyticsPackage_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    GetProductAnalysis(argument: _analyticsPackage_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    GetProductAnalysis(argument: _analyticsPackage_Empty, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    getProductAnalysis(argument: _analyticsPackage_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    getProductAnalysis(argument: _analyticsPackage_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    getProductAnalysis(argument: _analyticsPackage_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

    getProductAnalysis(argument: _analyticsPackage_Empty, callback: grpc.requestCallback<_analyticsPackage_grpcProductAnalysis__Output>): grpc.ClientUnaryCall;

}

export interface AnalyticServiceHandlers extends grpc.UntypedServiceImplementation {
    GetProductAnalysis: grpc.handleUnaryCall<_analyticsPackage_Empty__Output, _analyticsPackage_grpcProductAnalysis>;

}

export interface AnalyticServiceDefinition extends grpc.ServiceDefinition {
    GetProductAnalysis: MethodDefinition<_analyticsPackage_Empty, _analyticsPackage_grpcProductAnalysis, _analyticsPackage_Empty__Output, _analyticsPackage_grpcProductAnalysis__Output>;
}
