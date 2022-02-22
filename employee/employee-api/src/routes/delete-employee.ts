import express, { Request, Response } from "express";
import { requireAuth, validateCurrentUser } from "@espressotrip-org/concept-common";

const router = express.Router();

router.delete("/api/employee/:employeeId", validateCurrentUser, requireAuth , async (req: Request, res: Response) => {

});

export { router as deleteEmployeeRouter };
