import { GitHubDone, GitHubFunction, GitHubOptions } from "@espressotrip-org/concept-common";
import { Profile } from "passport-github2";
import { SignInTypes, User } from "../models";
import { CreateUserPublisher } from "../events/publishers/create-user-publisher";
import { rabbitClient } from "../rabbitmq-client";

export const gitHubFunction: GitHubFunction = async function (accessToken: string, refreshToken: string, profile: Profile, done:GitHubDone) {
    try {
        // @ts-ignore
        let user = await User.findOne({ email: profile.emails[0].value, signInType: SignInTypes.GITHUB, providerId: profile.id });

        if (user) {
            return done(null, user);
        } else {
            user = new User(User.buildUserFromGitHub(profile));
            await user.save();

            /** Publish create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(user);
        }
        return done(null, user);
    } catch (error) {
        console.error(`[github:auth]: Error authorizing user ${(error as Error).message}`);
        done(error as Error);
    }
};

export const gitHubOptions: GitHubOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
}
