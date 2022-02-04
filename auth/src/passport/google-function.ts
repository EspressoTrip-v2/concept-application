import { GoogleFunction, GoogleOptions } from "@espressotrip-org/concept-common";
import { Profile, VerifyFunction } from "passport-google-oauth";
import { SignInTypes, User } from "../models";
import { CreateUserPublisher } from "../events/publishers/create-user-publisher";
import { rabbitClient } from "../rabbitmq-client";

export const googleFunction: GoogleFunction = async function (accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction) {
    try {
        let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.GOOGLE, providerId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            user = new User(User.buildUserFromGoogle(profile));
            await user.save();

            /** Publish create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(user);
        }
        return done(null, user);
    } catch (error) {
        console.error(`[google:auth]: Error authorizing user ${(error as Error).message}`);
        done(error as Error);
    }
};

export const googleOptions: GoogleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}
