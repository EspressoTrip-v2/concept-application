import passport from "passport";
import { OAuth2Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyFunction as GoogleVerificationFunc } from "passport-google-oauth";
import { Strategy as FacebookStrategy, Profile as FaceBookProfile } from "passport-facebook";
import { Profile as GitHubProfile, Strategy as GitHubStrategy } from "passport-github2";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { SignInTypes, User, UserSessionId } from "../models";

/** Serialization */
passport.serializeUser<UserSessionId>((user: Express.User, done: (err: any, id?: UserSessionId) => void) => {
    done(null, user as UserSessionId);
});

passport.deserializeUser<UserSessionId>(async (user: UserSessionId, done: (err: any, user?: Express.User | false | null) => void) => {
    const storedUser = await User.findOne({ email: user.email, id: user.id }).catch(error => done(error));
    if (storedUser) {
        return done(null, user);
    }
    return done(null, false);
});

/** Strategies */
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: GoogleVerificationFunc) => {
            let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.GOOGLE, providerId: profile.id }).catch(error => done(error));
            if (user) {
                return done(null, user);
            } else {
                user = new User(User.buildUserFromGoogle(profile));
                await user.save();
            }
            return done(null, user);
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
        async (accessToken: string, refreshToken: string, profile: FaceBookProfile, done: (error: any, user?: any, info?: any) => void) => {
            let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.FACEBOOK, providerId: profile.id }).catch(error => done(error));
            if (user) {
                return done(null, user);
            } else {
                user = new User(User.buildUserFromFaceBook(profile));
                await user.save();
            }
            return done(null, user);
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            callbackURL: process.env.GITHUB_CALLBACK_URL!,
        },
        async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (err?: Error | null, user?: Express.User, info?: object) => void) => {
            // @ts-ignore
            let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.GITHUB, providerId: profile.id }).catch(error => done(error));

            if (user) {
                return done(null, user);
            } else {
                // @ts-ignore
                user = new User(User.buildUserFromGitHub(profile));
                await user.save();
            }
            return done(null, user);
        }
    )
);

passport.use(
    new LocalStrategy(
        { passwordField: "password", usernameField: "email" },
        async (username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
            let user = await User.findOne({ email: username, signInType: SignInTypes.LOCAL }).catch(error => done(error));
            if (user) {
                return done(null, user);
            } else {
                user = new User(User.buildUserFromLocal({ email: username, password }));
                await user.save();
            }
            return done(null, user);
        }
    )
);
