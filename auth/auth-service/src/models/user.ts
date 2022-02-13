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
        categories: {
            type: Array,
            default: [],
        },
        password: {
            type: String,
            default: "",
        },
        providerId: {
            type: String,
            default: "",
        },
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

/** Set temporary analytics object on creation */
userSchema.post("save", async function () {
    userSchema.virtual("analytics").get(function () {
        return {
            serviceName: MicroServiceNames.AUTH_SERVICE,
            dateSent: new Date().toISOString(),
        };
    });
});

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
 * @param profile {GitHubUser}
 * @return {UserAttrs}
 */
userSchema.statics.buildUserFromGitHub = function (profile: GitHubGrpcUser): UserAttrs {
    return {
        name: profile.name!,
        providerId: profile.id!.toString()!,
        signInType: SignInTypes.GITHUB,
        email: profile.email!,
    };
};

/**
 * Creates a user attributes object from Google profile
 * @param profile {GoogleUser}
 */
userSchema.statics.buildUserFromGoogle = function (profile: GoogleGrpcUser): UserAttrs {
    return {
        name: profile.name!,
        providerId: profile.sub,
        signInType: SignInTypes.GOOGLE,
        email: profile.email!,
    };
};

/**
 * Creates a user attributes object from Local profile
 * @param profile {LocalUser}
 */
userSchema.statics.buildUserFromLocal = function (profile: LocalGrpcUser): UserAttrs {
    return {
        name: profile.name!,
        email: profile.email!,
        password: profile.password,
        signInType: SignInTypes.LOCAL,
    };
};

/** Create model from schema */
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
