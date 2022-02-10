import mongoose from "mongoose";
import { Categories, GitHubAuthProfile, GoogleAuthProfile, LocalAuthProfile, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";

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

export interface UserUpdateAttrs {
    name?: string;
    userRole?: UserRoles;
    categories?: Array<Categories>;
    password?: string | null;
    providerId?: string | null;
}
/** Static build method to model */
export interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttrs): UserDoc;
    buildUserFromGitHub(profile: GitHubAuthProfile): UserAttrs;
    buildUserFromGoogle(profile: GoogleAuthProfile): UserAttrs;
    buildUserFromLocal(profile: LocalAuthProfile): UserAttrs;
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
