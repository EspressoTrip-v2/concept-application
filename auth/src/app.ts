import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@espressotrip-org/concept-common";
import * as Routers from "./routes";
import session from "express-session";
import passport from "passport";
import './passport/passport-setup'

const app = express();

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

app.use(Routers.signUpRouter);
app.use(Routers.signInRouter);
app.use(Routers.signOutRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError("Page not found");
});

/** Error handler */
app.use(errorHandler);

export { app };
