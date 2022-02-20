import express, { Request, Response } from "express";
import { LogClientOptions, LogCodes, LogPublisher, MicroServiceNames, rabbitClient, validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

const LOG_OPTIONS: LogClientOptions = {
    serviceName: MicroServiceNames.AUTH_API,
    publisherName: "auth-api-signout-auth:route",
};

router.post("/api/auth/signout", validateCurrentUser, (req: Request, res: Response) => {
    const logger = LogPublisher.getPublisher(rabbitClient.connection, LOG_OPTIONS);
    console.log(req.currentUser);
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
