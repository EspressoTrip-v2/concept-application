import mongoose from "mongoose";
import { EmployeeMsg, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { GitHubGrpcUser } from "../services/proto/userPackage/GitHubGrpcUser";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";
import { LocalGrpcUser } from "../services/proto/userPackage/LocalGrpcUser";

/** User Interface */
export interface UserAttrs {
    firstName: string;
    lastName: string;
    gender: string;
    race: string;
    position: string;
    startDate: string;
    shiftPreference: string;
    branchName: string;
    region: string;
    country: string;
    phoneNumber: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    password?: string | null;
    providerId?: string | null;
}

/** Static build method to model */
export interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttrs): UserDoc;
    findByVersion(employee: EmployeeMsg): UserDoc | null;
}

/** Extend mongoose document with product document values */
export interface UserDoc extends mongoose.Document {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    race: string;
    position: string;
    startDate: string;
    shiftPreference: string;
    branchName: string;
    region: string;
    country: string;
    phoneNumber: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    password: string;
    providerId: string;
    version: number;
}
