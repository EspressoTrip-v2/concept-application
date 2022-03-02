import mongoose from "mongoose";
import { PersonMsg, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";

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
    registeredEmployee?: boolean;
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

    convertToGrpcMessage(document: UserDoc): PersonMsg;
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
    registeredEmployee: boolean;
    country: string;
    phoneNumber: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    password: string;
    providerId: string;
    version: number;
}
