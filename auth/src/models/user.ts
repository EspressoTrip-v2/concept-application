import mongoose from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { GitHubAuthProfile, GoogleAuthProfile, LocalAuthProfile, SignInTypes, UserRoles } from "@espressotrip-org/concept-common";
import { Password } from "../services";

/**
 * User model that uses update-if-current version incrementation
 */
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        signInType: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            default: UserRoles.BASIC,
        },
        groups: {
            type: Array,
            default: [],
        },
        password: {
            type: String,
            default: null,
        },
        providerId: {
            type: String,
            default: null,
        },
    },
    {
        toJSON: {
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

/**
 * Creates a user attributes object from GitHub profile
 * @param profile {GitHubAuthProfile}
 * @return {UserAttrs}
 */
userSchema.statics.buildUserFromGitHub = function (profile: GitHubAuthProfile): UserAttrs {
    return {
        name: profile.name,
        providerId: profile.id.toString(),
        signInType: SignInTypes.GITHUB,
        email: profile.email,
    };
};

/**
 * Creates a user attributes object from Google profile
 * @param profile {GoogleAuthProfile}
 */
userSchema.statics.buildUserFromGoogle = function (profile: GoogleAuthProfile): UserAttrs {
    return {
        name: profile.name,
        providerId: profile.sub,
        signInType: SignInTypes.GOOGLE,
        email: profile.email,
    };
};

/**
 * Creates a user attributes object from Local profile
 * @param profile {LocalAuthProfile}
 */
userSchema.statics.buildUserFromLocal = function (profile: LocalAuthProfile): UserAttrs {
    return {
        name: profile.name,
        email: profile.email,
        password: profile.password,
        signInType: SignInTypes.LOCAL,
    };
};

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
