import passport from "passport";
import { OAuth2Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyFunction as GoogleVerificationFunc } from "passport-google-oauth";
import { Strategy as FacebookStrategy, Profile as FaceBookProfile } from "passport-facebook";
import { Profile as GitHubProfile, Strategy as GitHubStrategy } from "passport-github2";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { SignInTypes, User, UserSessionId } from "../models";
import { CreateUserPublisher } from "../events/publishers/create-user-publisher";
import { rabbitClient } from "../rabbitmq-client";
import { MongooseError } from "@espressotrip-org/concept-common";

/** Serialization */
// passport.serializeUser<UserSessionId>((user: Express.User, done: (err: any, id?: UserSessionId) => void) => {
//     done(null, user as UserSessionId);
// });
//
// passport.deserializeUser<UserSessionId>(async (user: UserSessionId, done: (err: any, user?: Express.User | false | null) => void) => {
//     const storedUser = await User.findOne({ email: user.email, id: user.id }).catch(error => done(new MongooseError(error.message)));
//     if (storedUser) {
//         return done(null, user);
//     }
//     return done(null, false);
// });

/**
 * The checking of users for different strategies can be more granular, however for POC I will allow multiple users with
 * the same email to exist as long as they have different login strategies.
 */

/** Strategies */
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_SECRET!,
//             callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//         },
//         async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: GoogleVerificationFunc) => {
//             try {
//                 let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.GOOGLE, providerId: profile.id });
//                 if (user) {
//                     return done(null, user);
//                 } else {
//                     user = new User(User.buildUserFromGoogle(profile));
//                     await user.save();
//
//                     /** Publish create user event */
//                     await new CreateUserPublisher(rabbitClient.connection).publish(user);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 console.error(`[google:auth]: Error authorizing user ${(error as Error).message}`);
//                 done(error as Error);
//             }
//         }
//     )
// );

// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_CLIENT_ID!,
//             clientSecret: process.env.FACEBOOK_SECRET!,
//             callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
//         },
//         async (accessToken: string, refreshToken: string, profile: FaceBookProfile, done: (error: any, user?: any, info?: any) => void) => {
//             try {
//                 let user = await User.findOne({ email: profile._json.email, signInType: SignInTypes.FACEBOOK, providerId: profile.id });
//                 if (user) {
//                     return done(null, user);
//                 } else {
//                     user = new User(User.buildUserFromFaceBook(profile));
//                     await user.save();
//
//                     /** Publish create user event */
//                     await new CreateUserPublisher(rabbitClient.connection).publish(user);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 console.error(`[facebook:auth]: Error authorizing user ${(error as Error).message}`);
//                 done(error as Error);
//             }
//         }
//     )
// );

// passport.use(
//     new GitHubStrategy(
//         {
//             clientID: process.env.GITHUB_CLIENT_ID!,
//             clientSecret: process.env.GITHUB_SECRET!,
//             callbackURL: process.env.GITHUB_CALLBACK_URL!,
//         },
//         async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (err?: Error | null, user?: Express.User, info?: object) => void) => {
//             try {
//                 // @ts-ignore
//                 let user = await User.findOne({ email: profile.emails[0].value, signInType: SignInTypes.GITHUB, providerId: profile.id });
//
//                 if (user) {
//                     return done(null, user);
//                 } else {
//                     user = new User(User.buildUserFromGitHub(profile));
//                     await user.save();
//
//                     /** Publish create user event */
//                     await new CreateUserPublisher(rabbitClient.connection).publish(user);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 console.error(`[github:auth]: Error authorizing user ${(error as Error).message}`);
//                 done(error as Error);
//             }
//         }
//     )
// );

// passport.use(
//     new LocalStrategy(
//         { passwordField: "password", usernameField: "email" },
//         async (username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) => {
//             try {
//                 let user = await User.findOne({ email: username, signInType: SignInTypes.LOCAL });
//                 if (user) {
//                     return done(null, user);
//                 } else {
//                     user = new User(User.buildUserFromLocal({ email: username, password }));
//                     await user.save();
//
//                     /** Publish create user event */
//                     await new CreateUserPublisher(rabbitClient.connection).publish(user);
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 console.error(`[local:auth]: Error authorizing user ${(error as Error).message}`);
//                 done(error as Error);
//             }
//         }
//     )
// );
