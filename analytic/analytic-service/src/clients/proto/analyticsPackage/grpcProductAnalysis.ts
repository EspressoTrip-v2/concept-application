// Original file: src/clients/proto/analytic.proto

import type { grpcProductBreakDown as _analyticsPackage_grpcProductBreakDown, grpcProductBreakDown__Output as _analyticsPackage_grpcProductBreakDown__Output } from '../analyticsPackage/grpcProductBreakDown';

export interface grpcProductAnalysis {
  'products'?: ({[key: string]: _analyticsPackage_grpcProductBreakDown});
}

export interface grpcProductAnalysis__Output {
  'products': ({[key: string]: _analyticsPackage_grpcProductBreakDown__Output});
}
