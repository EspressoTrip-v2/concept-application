import express, { Request, Response } from "express";
import { requireAuth, requiredRoles, UserRoles } from "@espressotrip-org/concept-common";

const router = express.Router();

/** query: ?startDate=01032022&endDate=01052022 */
router.get("/api/analytic/orders", requireAuth, requiredRoles(UserRoles.ADMIN), async (req: Request, res: Response) => {
    res.send(req.currentUser);
});

export { router as getOrdersByDateRouter };
