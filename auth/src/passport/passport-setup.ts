import passport from "passport";
import { OAuth2Strategy as GoogleStrategy, VerifyFunction as GoogleVerificationFunc, Profile as GoogleProfile } from "passport-google-oauth";
import { Strategy as FacebookStrategy} from "passport-facebook";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import { VerifyCallback } from "passport-oauth2";
import {  UserSessionId } from "../models";

/** Serialization */
passport.serializeUser<UserSessionId>((user: Express.User , done: (err: any, id?: UserSessionId) => void)=>{

})


/** Strategies */
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        (accessToken: string, refreshToken: string, profile: GoogleProfile, done: GoogleVerificationFunc) => {
            console.log(profile);
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
        },
        () => {}
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            callbackURL: process.env.GITHUB_CALLBACK_URL!,
        },
        (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user: VerifyCallback) => void) => {
            console.log(profile);

        }
    )
);
