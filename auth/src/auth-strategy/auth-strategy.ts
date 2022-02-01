import { Strategy } from "passport-local";
import passport from "passport";

export function initialize(): void {
    passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
        console.log(user);
        done(null, user);
    });

    passport.deserializeUser((id, done: (err: any, id?: unknown) => void) => {
        console.log(id);
    });

    passport.use(
        new Strategy({ usernameField: "email", passwordField: "password" }, (username: string, password: string, done: (err: any, id?: unknown) => void) => {
            console.log(username);
            console.log(password);
        })
    );
}
