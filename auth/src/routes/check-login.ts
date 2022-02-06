import express, { Request, Response } from "express";
import { validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

router.get("/api/auth/login-success", validateCurrentUser, async (req: Request, res: Response) => {
    res.send({ user: req.currentUser, cookie: req.session?.jwt });
});

export { router as checkLogInRouter };
