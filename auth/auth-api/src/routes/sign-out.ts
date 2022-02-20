import express, { Request, Response } from "express";
import { LogCodes, LogPublisher, MicroServiceNames, rabbitClient, validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

router.post("/api/auth/signout", validateCurrentUser, (req: Request, res: Response) => {
    const logger = LogPublisher.getPublisher(rabbitClient.connection, "auth-api:signout");
    /** Log Event */
    logger.publish({
        service: MicroServiceNames.AUTH_API,
        logContext: LogCodes.INFO,
        message: `User SignOut`,
        details: `email: ${req.currentUser?.email}`,
        origin: "/api/auth/signout",
        date: new Date().toISOString(),
    });

    req.session = null;
    res.send({ cookie: req.session });
});

export { router as signOutRouter };
