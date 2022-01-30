import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@common";
import cookieSession from "cookie-session";
import * as Routers from "./routes";

const app = express();

/** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
    })
);

/** Routes */
app.use(Routers.signUpRouter);
app.use(Routers.signInRouter);
app.use(Routers.signOutRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError('Page not found');
});

/** Error handler */
app.use(errorHandler);

export { app };
