import mongoose from "mongoose";
import { UserModel, UserDoc, UserAttrs } from "./interfaces";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { UserRoles } from "@espressotrip-org/concept-common";
import { Profile as GitHubProfile } from "passport-github2";
import {  Profile as GoogleProfile } from "passport-google-oauth";

/**
 * User model that uses update-if-current version incrementation
 */
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
        },
        gitHubId: {
            type: String,
            default: null,
        },
        googleId: {
            type: String,
            default: null,
        },
        userRoles: {
            type: Array,
            default: [UserRoles.BASIC],
        },
        groups: {
            type: Array,
            default: [],
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
userSchema.statics.buildUserFromGitHub = function(profile: GitHubProfile): UserAttrs {
    return {
        name: profile.displayName,
        gitHubId: profile.id,
        // @ts-ignore
        email: profile._json.email,
    }
}

/**
 * Creates a user attributes object from Google profile
 * @param profile
 */
userSchema.statics.buildUserFromGoogle = function(profile: GoogleProfile): UserAttrs {
    return {
        name: profile.displayName,
        googleId: profile.id,
        email: profile._json.email,
    }
}

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
