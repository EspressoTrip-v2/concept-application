import mongoose from "mongoose";
import { PersonMsg, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";

/** User Interface */
export interface EmployeeAttrs {
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
    authId?: string;
    country: string;
    phoneNumber: string;
    email: string;
    signInType?: SignInTypes;
    userRole?: UserRoles;
    password?: string | null;
    providerId?: string | null;
}

/** Static build method to model */
export interface EmployeeModel extends mongoose.Model<EmployeeDoc> {
    build(attributes: EmployeeAttrs): EmployeeDoc;

    convertToGrpcMessageForAuth(document: EmployeeDoc): PersonMsg;

    updateByEvent(employee: PersonMsg): Promise<EmployeeDoc | null>;
}

/** Extend mongoose document with product document values */
export interface EmployeeDoc extends mongoose.Document {
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
    authId: string;
    country: string;
    phoneNumber: string;
    email: string;
    signInType: SignInTypes;
    userRole?: UserRoles;
    password: string;
    providerId: string;
    version: number;
}
