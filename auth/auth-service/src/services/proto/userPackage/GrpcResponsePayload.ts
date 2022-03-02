// Original file: src/services/proto/user.proto

import type { GrpcUser as _userPackage_GrpcUser, GrpcUser__Output as _userPackage_GrpcUser__Output } from "../userPackage/GrpcUser";

export interface GrpcResponsePayload {
    "status"?: (number);
    "jwt"?: (string);
    "data"?: (_userPackage_GrpcUser | null);
}

export interface GrpcResponsePayload__Output {
    "status": (number);
    "jwt": (string);
    "data": (_userPackage_GrpcUser__Output | null);
}
