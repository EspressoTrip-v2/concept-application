import mongoose from "mongoose";
import { UserRoles } from "@espressotrip-org/concept-common";
import { Profile as GitHubProfile } from "passport-github2";
import { Profile as GoogleProfile } from "passport-google-oauth";
import { Profile as FaceBookProfile } from "passport-facebook";

export const enum SignInTypes{
    GOOGLE = 'google',
    GITHUB =   'github',
    FACEBOOK= 'facebook',
    LOCAL = 'local'
}


/** User Interface */
export interface UserAttrs {
    name: string;
    email: string;
    signInType: SignInTypes;
    userRoles?: Array<UserRoles>;
    groups?: Array<string>;
    password?: string | null
    providerId?: string | null
}

export interface FormValues{
    email: string;
    password: string
}

export interface UserSessionId {
    id: string;
    name: string;
    email: string;
    userRoles: Array<UserRoles>;
}

/** Static build method to model */
export interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttrs): UserDoc;
    buildUserFromGitHub(profile: GitHubProfile): UserAttrs;
    buildUserFromGoogle(profile: GoogleProfile): UserAttrs;
    buildUserFromLocal(profile: FormValues): UserAttrs;
    buildUserFromFaceBook(profile: FaceBookProfile): UserAttrs
}

/** Extend mongoose document with product document values */
export interface UserDoc extends mongoose.Document {
    id: string;
    name: string;
    email: string;
    gitHubId: string;
    googleId: string;
    userRoles: Array<UserRoles>;
    groups: Array<string>;
    version: number;
}
