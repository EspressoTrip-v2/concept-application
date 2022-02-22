import express, { Request, Response } from "express";
import { payloadValidation, requireAuth, validateCurrentUser } from "@espressotrip-org/concept-common";
import { updateEmployeeSchema } from "../payload-schemas";

const router = express.Router();

router.patch("/api/employee", validateCurrentUser, requireAuth ,payloadValidation(updateEmployeeSchema), async (req: Request, res: Response) => {

});

export { router as updateEmployeeRouter };
