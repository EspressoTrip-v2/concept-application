import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@espressotrip-org/concept-common";
import * as Routers from "./routes";
import session from "express-session";

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
            secure: process.env.NODE_ENV === "production",
            signed: false,
        },
    })
);

/** Routes */
app.use(Routers.createProductRouter);
app.use(Routers.updateProductRouter);
app.use(Routers.getProductsRouter);
app.use(Routers.getSingleProductRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError("Page not found");
});

/** Error handler */
app.use(errorHandler);

export { app };
