import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError, validateCurrentUser } from "@espressotrip-org/concept-common";
import * as Routers from "./routes";
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
    }),
);

/** User Validation */
app.use(validateCurrentUser);

/** Routes */
app.use(Routers.getAbsenteesRouter);
app.use(Routers.getShiftScheduleRouter);
app.use(Routers.getShiftProductivityRouter);
app.use(Routers.getActiveWorkingRouter);
app.use(Routers.getJobsCompletedRouter);
app.use(Routers.getJobCompletionTimeRouter);
app.use(Routers.getJobsIncompleteRouter);
app.use(Routers.getJobsInProgressRouter);
app.use(Routers.getShiftCountDownRouter);

/** Not Found */
app.all("*", async () => {
    throw new NotFoundError("Page not found");
});

/** Error handler */
app.use(errorHandler);

export { app };
