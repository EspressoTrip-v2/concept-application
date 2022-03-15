import express, { Request, Response } from "express";
import { payloadValidation, requireAuth, requiredRoles, UserRoles } from "@espressotrip-org/concept-common";
import { updateEmployeeSchema } from "../payload-schemas";
import { GrpcEmployeeAttributes } from "../services/proto/employeePackage/GrpcEmployeeAttributes";
import { GrpcEmployeeClient } from "../services";

const router = express.Router();

router.patch("/api/employee", requireAuth, requiredRoles(UserRoles.ADMIN), payloadValidation(updateEmployeeSchema), async (req: Request, res: Response) => {
    const employeeAttributes: GrpcEmployeeAttributes = req.body;
    const grpcResponse = await GrpcEmployeeClient.getClient().updateEmployee(employeeAttributes);
    res.send(grpcResponse);
});

export { router as updateEmployeeRouter };
