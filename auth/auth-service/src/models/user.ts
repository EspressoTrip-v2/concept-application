import mongoose from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import jwt from "jsonwebtoken";
import { GenderType, PersonMsg, RaceTypes, ShiftPreference, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { Password } from "../utils";

/**
 * User model that uses update-if-current version incrementation
 */
const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        race: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String, required: true },
        shiftPreference: { type: String, required: true },
        branchName: { type: String, required: true },
        region: { type: String, required: true },
        registeredEmployee: { type: Boolean, default: false },
        country: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        signInType: { type: String, required: true, default: SignInTypes.UNKNOWN },
        userRole: { type: String, required: true },
        password: { type: String, default: "" },
        providerId: { type: String, default: "" },
    },
    {
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

/** Replace the __v with version  && use the update-if-current plugin*/
userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

/** Encrypt the password on save */
userSchema.pre("save", async function (done) {
    const password = this.get("password");
    if (password && this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});
/** Static schema functions */
/**
 * Static function to build product
 * @param attributes
 */
userSchema.statics.build = function (attributes: UserAttrs): UserDoc {
    return new User(attributes);
};

userSchema.statics.convertToGrpcMessage = function (document: UserDoc): PersonMsg {
    return {
        id: document.id,
        country: document.country,
        email: document.email,
        gender: document.gender as GenderType,
        branchName: document.branchName,
        lastName: document.lastName,
        password: document.password,
        race: document.race as RaceTypes,
        region: document.region,
        registeredEmployee: document.registeredEmployee,
        position: document.position,
        providerId: document.providerId,
        shiftPreference: document.shiftPreference as ShiftPreference,
        startDate: document.startDate,
        signInType: document.signInType,
        authId: document.id,
        userRole: document.userRole as UserRoles,
        firstName: document.firstName,
        phoneNumber: document.phoneNumber,
    };
};

userSchema.statics.convertToJWTPayload = function (document: UserDoc): string {

    const msg =  {
        country: document.country,
        email: document.email,
        gender: document.gender as GenderType,
        branchName: document.branchName,
        lastName: document.lastName,
        password: document.password,
        race: document.race as RaceTypes,
        region: document.region,
        registeredEmployee: document.registeredEmployee,
        position: document.position,
        providerId: document.providerId,
        shiftPreference: document.shiftPreference as ShiftPreference,
        startDate: document.startDate,
        signInType: document.signInType,
        authId: document.id,
        userRole: document.userRole as UserRoles,
        firstName: document.firstName,
        phoneNumber: document.phoneNumber,
    }
    return jwt.sign(msg, process.env.JWT_KEY!)
};

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
