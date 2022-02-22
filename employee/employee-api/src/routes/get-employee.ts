import express, { Request, Response } from "express";
import { requireAuth, validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

router.get("/api/employee/:employeeId", validateCurrentUser, requireAuth , async (req: Request, res: Response) => {

});

export { router as getEmployeeRouter };
