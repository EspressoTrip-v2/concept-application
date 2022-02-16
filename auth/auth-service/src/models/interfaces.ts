import mongoose from "mongoose";
import { SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { GitHubGrpcUser } from "../clients/proto/userPackage/GitHubGrpcUser";
import { GoogleGrpcUser } from "../clients/proto/userPackage/GoogleGrpcUser";
import { LocalGrpcUser } from "../clients/proto/userPackage/LocalGrpcUser";

/** User Interface */
export interface UserAttrs {
    firstName: string;
    lastName: string;
    gender: string;
    ethnicity: string;
    position: string;
    startDate: string;
    shiftPreference: string;
    branchName: string;
    region: string;
    country: string;
    phoneNUmber: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    password?: string | null;
    providerId?: string | null;
}

/** Static build method to model */
export interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttrs): UserDoc;
    buildUserFromGitHub(profile: GitHubGrpcUser): UserAttrs;
    buildUserFromGoogle(profile: GoogleGrpcUser): UserAttrs;
    buildUserFromLocal(profile: LocalGrpcUser): UserAttrs;
}

/** Extend mongoose document with product document values */
export interface UserDoc extends mongoose.Document {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    ethnicity: string;
    position: string;
    startDate: string;
    shiftPreference: string;
    branchName: string;
    region: string;
    country: string;
    phoneNUmber: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    password: string;
    providerId: string;
    version: number;
}
