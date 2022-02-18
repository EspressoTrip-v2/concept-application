// Original file: ../../analytic/proto/analytic.proto

import type { CategoryMap as _analyticsPackage_CategoryMap, CategoryMap__Output as _analyticsPackage_CategoryMap__Output } from '../analyticsPackage/CategoryMap';

export interface grpcProductBreakDown {
  'avgPrice'?: (number);
  'totalSold'?: (number);
  'totalInStock'?: (number);
  'category'?: (_analyticsPackage_CategoryMap | null);
}

export interface grpcProductBreakDown__Output {
  'avgPrice': (number);
  'totalSold': (number);
  'totalInStock': (number);
  'category': (_analyticsPackage_CategoryMap__Output | null);
}
