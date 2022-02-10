import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AnalyticsServiceClient as _analyticsPackage_AnalyticsServiceClient, AnalyticsServiceDefinition as _analyticsPackage_AnalyticsServiceDefinition } from './analyticsPackage/AnalyticsService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  analyticsPackage: {
    AnalyticsService: SubtypeConstructor<typeof grpc.Client, _analyticsPackage_AnalyticsServiceClient> & { service: _analyticsPackage_AnalyticsServiceDefinition }
    ClientAnalyticsRequest: MessageTypeDefinition
    ServerStreamAnalyticsResponse: MessageTypeDefinition
  }
}

