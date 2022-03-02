import express, { Request, Response } from "express";
import { validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

router.get("/api/auth/login-success", validateCurrentUser, async (req: Request, res: Response) => {
    if (!req.currentUser) {
        req.session = null;
        return res.send({ session: null });
    }
    res.send({ session: req.get("cookie") });
});

export { router as checkLogInRouter };
