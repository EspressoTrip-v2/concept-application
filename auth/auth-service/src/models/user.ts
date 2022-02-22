import mongoose from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { Password } from "../utils";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";
import { LocalGrpcUser } from "../services/proto/userPackage/LocalGrpcUser";

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
        country: { type: String, required: true },
        phoneNUmber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        signInType: { type: String, required: true, default: SignInTypes.UNKNOWN },
        userRole: {
            type: String,
            default: UserRoles.EMPLOYEE,
        },
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
    },
);

/** Replace the __v with version  && use the update-if-current plugin*/
userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

/** Encrypt the password on save */
userSchema.pre("save", async function(done) {
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
userSchema.statics.build = function(attributes: UserAttrs): UserDoc {
    return new User(attributes);
};

/**
 * Creates a user attributes object from GitHub profile
 * @param profile {GoogleGrpcUser}
 * @return {UserAttrs}
 */
// userSchema.statics.buildUserFromGitHub = function (profile: GitHubGrpcUser): UserAttrs {
//     const nameArray = profile.name?.split(" ") || [];
//     const firstName = nameArray[0] || "No GitHub first name supplied";
//     const lastName = nameArray.length > 1 ? nameArray[nameArray.length - 1] : "No GitHub last name supplied";
//     return {
//         // TODO: THIS IS TEMPORARY AS WE ARE NO LONGER CREATING USERS FROM THE API
//         firstName,
//         lastName,
//         branchName: "",
//         country: "",
//         gender: "",
//         race: "",
//         phoneNUmber: "",
//         position: "",
//         region: "",
//         shiftPreference: "",
//         startDate: new Date().toISOString(),
//         userRole: UserRoles.ADMIN,
//         password: "",
//         providerId: profile.id!.toString()!,
//         signInType: SignInTypes.GITHUB,
//         email: profile.email!,
//     };
// };

/**
 * Creates a user attributes object from Google profile
 * @param profile {GoogleGrpcUser}
 */
// userSchema.statics.buildUserFromGoogle = function (profile: GoogleGrpcUser): UserAttrs {
//     return {
//         // TODO: THIS IS TEMPORARY AS WE ARE NO LONGER CREATING USERS FROM THE API
//         firstName: profile.name!,
//         lastName: profile.given_name!,
//         branchName: "",
//         country: "",
//         gender: "",
//         race: "",
//         phoneNUmber: "",
//         position: "",
//         region: "",
//         shiftPreference: "",
//         startDate: new Date().toISOString(),
//         userRole: UserRoles.ADMIN,
//         password: "",
//         providerId: profile.sub,
//         signInType: SignInTypes.GOOGLE,
//         email: profile.email!,
//     };
// };

/**
 * Creates a user attributes object from Local profile
 * @param profile {LocalGrpcUser}
 */
// userSchema.statics.buildUserFromLocal = function (profile: LocalGrpcUser): UserAttrs {
//     return {
//         // TODO: THIS IS TEMPORARY AS WE ARE NO LONGER CREATING USERS FROM THE API
//         firstName: "",
//         lastName: "",
//         branchName: "",
//         country: "",
//         gender: "",
//         race: "",
//         phoneNUmber: "",
//         position: "",
//         region: "",
//         shiftPreference: "",
//         startDate: new Date().toISOString(),
//         userRole: UserRoles.ADMIN,
//         email: profile.email!,
//         password: profile.password,
//         signInType: SignInTypes.LOCAL,
//     };
// };

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
