import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@espressotrip-org/concept-common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);

/** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV === "production",
    })
);


/** Routes */
// app.use(Routers.googleAuthRouter);
// app.use(Routers.gitHubAuthRouter);
// app.use(Routers.localAuthRouter);
// app.use(Routers.signOutRouter);
// app.use(Routers.checkLogInRouter);
// app.use(Routers.updateUserRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError("Page not found");
});

/** Error handler */
app.use(errorHandler);

export { app };
