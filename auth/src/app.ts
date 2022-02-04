import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@espressotrip-org/concept-common";
import * as Routers from "./routes";
import session from "express-session";
import passport from "passport";
import { PassportAuthentication } from "@espressotrip-org/concept-common/build/passport";
import { UserSessionId } from "./models";
import { googleFunction, googleOptions, faceBookFunction, faceBookOptions } from "./passport";
import { gitHubFunction, gitHubOptions } from "./passport/gitHub-function";
import { localFunction, localOptions } from "./passport/local-function";
import { passportSerialize } from "./passport/serialize";
import { passportDeserialize } from "./passport/deserialize";

const app = express();
/** Passport Authentication Class */
new PassportAuthentication<UserSessionId>(passport)
    .google(googleOptions, googleFunction)
    .faceBook(faceBookOptions, faceBookFunction)
    .gitHub(gitHubOptions, gitHubFunction)
    .local(localOptions, localFunction)
    .serializeUser(passportSerialize)
    .deserializeUser(passportDeserialize);

/** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            signed: false,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

/** Routes */
app.use(Routers.facebookAuthRouter);
app.use(Routers.googleAuthRouter);
app.use(Routers.githubAuthRouter);
app.use(Routers.localAuthRouter);
app.use(Routers.signOutRouter);
app.use(Routers.checkLogInRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError("Page not found");
});

/** Error handler */
app.use(errorHandler);

export { app };
