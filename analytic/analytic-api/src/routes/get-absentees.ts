import express, { Request, Response } from "express";
import { requireAuth, requiredRoles, UserRoles } from "@espressotrip-org/concept-common";

const router = express.Router();

router.get("/api/analytic/products/absentees", requireAuth, requiredRoles(UserRoles.ADMIN), async (req: Request, res: Response) => {
    res.send(req.currentUser);
});

export { router as getAbsenteesRouter };
