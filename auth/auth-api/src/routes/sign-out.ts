import express, { Request, Response } from "express";
import { LogCodes, validateCurrentUser } from "@espressotrip-org/concept-common";
import { LocalLogger } from "../utils";

const router = express.Router();

router.post("/api/auth/signout", validateCurrentUser, (req: Request, res: Response) => {

    /** Log Event */
    LocalLogger.log(LogCodes.INFO, `User SignOut`, "/api/auth/signout", `email: ${req.currentUser?.email}`);

    req.session = null;
    res.send({ cookie: req.session });
});

export { router as signOutRouter };
