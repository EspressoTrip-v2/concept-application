import express, { Request, Response } from "express";
import { payloadValidation, requireAuth, validateCurrentUser } from "@espressotrip-org/concept-common";
import { createEmployeeSchema } from "../payload-schemas";


const router = express.Router();

router.put("/api/employee", validateCurrentUser, requireAuth ,payloadValidation(createEmployeeSchema), async (req: Request, res: Response) => {

});

export { router as createEmployeeRouter };
