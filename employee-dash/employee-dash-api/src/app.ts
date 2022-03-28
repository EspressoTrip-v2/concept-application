import { errorHandler, NotFoundError } from "@espressotrip-org/concept-common";
import express from "express";
import "express-async-errors";
import * as Routers from "./routes";
import cookieSession from "cookie-session";
import grant from "grant";
import { grantConfig } from "./utils";
import * as path from "path";

const app = express();
app.set("trust proxy", true);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

/** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV === "production",
    })
);

/** OAuth route */
app.use(grant.express(grantConfig()));

/** Routes */
app.use(Routers.googleAuthRouter);
app.use(Routers.gitHubAuthRouter);
app.use(Routers.localAuthRouter);
app.use(Routers.signOutRouter);
app.use(Routers.checkLogInRouter);
app.use(Routers.getEmployeeRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError("Page not found");
});

/** Error handler */
app.use(errorHandler);

export { app };
