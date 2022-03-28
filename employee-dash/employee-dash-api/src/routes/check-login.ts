import express, { Request, Response } from "express";
import { requireAuth, requiredRoles, UserRoles, validateCurrentUser } from "@espressotrip-org/concept-common";
const router = express.Router();
router.get("/api/auth/login-success", validateCurrentUser, requireAuth, requiredRoles(UserRoles.ADMIN), async (req: Request, res: Response) => {
    res.send({ status: 200, data: req.currentUser });
});
export { router as checkLogInRouter };
