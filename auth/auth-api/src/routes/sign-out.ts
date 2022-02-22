import express, { Request, Response } from "express";
import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient, validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

router.post("/api/auth/signout", validateCurrentUser, (req: Request, res: Response) => {
    const logger = LogPublisher.getPublisher(rabbitClient.connection, MicroServiceNames.AUTH_API, "auth-api:signout");

    /** Log Event */
    logger.publish(LogCodes.INFO, `User SignOut`, "/api/auth/signout", `email: ${req.currentUser?.email}`);

    req.session = null;
    res.send({ cookie: req.session });
});

export { router as signOutRouter };
