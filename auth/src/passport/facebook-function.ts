import { FaceBookDone, FaceBookFunction, FaceBookOptions } from "@espressotrip-org/concept-common";
import { Profile } from "passport-facebook";
import { SignInTypes, User } from "../models";
import { CreateUserPublisher } from "../events/publishers/create-user-publisher";
import { rabbitClient } from "../rabbitmq-client";

export const faceBookFunction: FaceBookFunction = async function (accessToken: string, refreshToken: string, profile: Profile, done: FaceBookDone ) {
    try {
        let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.GOOGLE, providerId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            user = new User(User.buildUserFromFaceBook(profile));
            await user.save();

            /** Publish create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(user);
        }
        return done(null, user);
    } catch (error) {
        console.error(`[facebook:auth]: Error authorizing user ${(error as Error).message}`);
        done(error as Error);
    }
};

export const faceBookOptions: FaceBookOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}
