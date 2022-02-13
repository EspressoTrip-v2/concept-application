import mongoose from "mongoose";
import { Categories, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { GitHubGrpcUser } from "../clients/proto/userPackage/GitHubGrpcUser";
import { GoogleGrpcUser } from "../clients/proto/userPackage/GoogleGrpcUser";
import { LocalGrpcUser } from "../clients/proto/userPackage/LocalGrpcUser";

/** User Interface */
export interface UserAttrs {
    name: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    categories?: Array<Categories>;
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
    name: string;
    email: string;
    signInType: SignInTypes;
    userRole: UserRoles;
    providerId: string;
    categories: Array<Categories>;
    password: string;
    version: number;
}
