import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AnalyticServiceClient as _analyticsPackage_AnalyticServiceClient, AnalyticServiceDefinition as _analyticsPackage_AnalyticServiceDefinition } from './analyticsPackage/AnalyticService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  analyticsPackage: {
    AnalyticService: SubtypeConstructor<typeof grpc.Client, _analyticsPackage_AnalyticServiceClient> & { service: _analyticsPackage_AnalyticServiceDefinition }
    CategoryMap: MessageTypeDefinition
    Empty: MessageTypeDefinition
    grpcOrder: MessageTypeDefinition
    grpcProduct: MessageTypeDefinition
    grpcProductAnalysis: MessageTypeDefinition
    grpcProductBreakDown: MessageTypeDefinition
    grpcService: MessageTypeDefinition
  }
}

