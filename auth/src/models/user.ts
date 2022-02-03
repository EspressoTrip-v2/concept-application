import mongoose from "mongoose";
import { FormValues, SignInTypes, UserAttrs, UserDoc, UserModel } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { UserRoles } from "@espressotrip-org/concept-common";
import { Profile as GitHubProfile } from "passport-github2";
import { Profile as GoogleProfile } from "passport-google-oauth";
import { Profile as FaceBookProfile } from "passport-facebook";
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
            unique: true
        },
        signInType: {
            type: String,
            required: true,
        },
        userRoles: {
            type: Array,
            default: [UserRoles.BASIC],
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
    const password = this.get('password');
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
 * Creates a user attributes object from Github profile
 * @param profile {GitHubProfile}
 * @return {UserAttrs}
 */
userSchema.statics.buildUserFromGitHub = function (profile: GitHubProfile): UserAttrs {
    return {
        name: profile.displayName,
        providerId: profile.id,
        signInType: SignInTypes.GITHUB,
        // @ts-ignore
        email: profile._json.email,
    };
};

/**
 * Creates a user attributes object from Facebook profile
 * @param profile {FaceBookProfile}
 * @return {UserAttrs}
 */
userSchema.statics.buildUserFromFaceBook = function (profile: FaceBookProfile): UserAttrs {
    return {
        name: profile.displayName,
        providerId: profile.id,
        signInType: SignInTypes.FACEBOOK,
        email: profile._json.email,
    };
};

/**
 * Creates a user attributes object from Google profile
 * @param profile {GoogleProfile}
 */
userSchema.statics.buildUserFromGoogle = function (profile: GoogleProfile): UserAttrs {
    return {
        name: profile.displayName,
        providerId: profile.id,
        signInType: SignInTypes.GOOGLE,
        email: profile._json.email,
    };
};

/**
 * Creates a user attributes object from Local profile
 * @param profile {FormValues}
 */
userSchema.statics.buildUserFromLocal = function (profile: FormValues): UserAttrs {
    return {
        name: profile.email,
        email: profile.email,
        password: profile.password,
        signInType: SignInTypes.LOCAL,
    };
};

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
