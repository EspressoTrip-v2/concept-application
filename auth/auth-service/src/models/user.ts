import mongoose from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { MicroServiceNames, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { Password } from "../services";
import { GitHubGrpcUser } from "../clients/proto/userPackage/GitHubGrpcUser";
import { GoogleGrpcUser } from "../clients/proto/userPackage/GoogleGrpcUser";
import { LocalGrpcUser } from "../clients/proto/userPackage/LocalGrpcUser";

/**
 * User model that uses update-if-current version incrementation
 */
const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        ethnicity: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: String, required: true },
        shiftPreference: { type: String, required: true },
        branchName: { type: String, required: true },
        region: { type: String, required: true },
        country: { type: String, required: true },
        phoneNUmber: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        signInType: { type: String, required: true, },
        userRole: {
            type: String,
            default: UserRoles.EMPLOYEE,
        },
        password: { ype: String, default: "", },
        providerId: { type: String, default: "", },
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

/** Set temporary analytics object on creation */
userSchema.post("save", async function() {
    userSchema.virtual("analytics").get(function() {
        return {
            serviceName: MicroServiceNames.AUTH_SERVICE,
            dateSent: new Date().toISOString(),
        };
    });
});

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
userSchema.statics.buildUserFromGitHub = function(profile: GitHubGrpcUser): UserAttrs {
    const nameArray = profile.name?.split(" ") || [];
    const firstName = nameArray[0] || "No GitHub first name supplied";
    const lastName = nameArray.length > 1 ? nameArray[nameArray.length - 1] : "No GitHub last name supplied";
    return {
        firstName,
        lastName,
        branchName: "",
        country:  "",
        gender: "",
        ethnicity: "",
        phoneNUmber: "",
        position: "",
        region: "",
        shiftPreference: "",
        startDate: new Date().toISOString(),
        userRole: UserRoles.ADMIN,
        password: "",
        providerId: profile.id!.toString()!,
        signInType: SignInTypes.GITHUB,
        email: profile.email!,
    };
};

/**
 * Creates a user attributes object from Google profile
 * @param profile {GoogleGrpcUser}
 */
userSchema.statics.buildUserFromGoogle = function(profile: GoogleGrpcUser): UserAttrs {
    return {
        firstName: profile.name!,
        lastName: profile.given_name!,
        branchName: "",
        country:  "",
        gender: "",
        ethnicity: "",
        phoneNUmber: "",
        position: "",
        region: "",
        shiftPreference: "",
        startDate: new Date().toISOString(),
        userRole: UserRoles.ADMIN,
        password: "",
        providerId: profile.sub,
        signInType: SignInTypes.GOOGLE,
        email: profile.email!,
    };
};

/**
 * Creates a user attributes object from Local profile
 * @param profile {LocalGrpcUser}
 */
userSchema.statics.buildUserFromLocal = function(profile: LocalGrpcUser): UserAttrs {
    return {
        firstName: profile.firstName!,
        lastName: profile.lastName!,
        branchName: "",
        country:  "",
        gender: "",
        ethnicity: "",
        phoneNUmber: "",
        position: "",
        region: "",
        shiftPreference: "",
        startDate: new Date().toISOString(),
        userRole: UserRoles.ADMIN,
        email: profile.email!,
        password: profile.password,
        signInType: SignInTypes.LOCAL,
    };
};

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
