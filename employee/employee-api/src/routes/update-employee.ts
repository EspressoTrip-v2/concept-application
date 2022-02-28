import express, { Request, Response } from "express";
import {
    grpcErrorTranslator,
    isGRPCStatus,
    payloadValidation,
    requireAuth,
    requiredRoles,
    UserRoles,
    validateCurrentUser,
} from "@espressotrip-org/concept-common";
import { updateEmployeeSchema } from "../payload-schemas";
import { GrpcEmployeeAttributes } from "../services/proto/employeePackage/GrpcEmployeeAttributes";
import { employeeGrpcClient } from "../services";

const router = express.Router();

router.patch(
    "/api/employee",
    requireAuth,
    requiredRoles(UserRoles.ADMIN),
    payloadValidation(updateEmployeeSchema),
    async (req: Request, res: Response) => {
        const employeeAttributes: GrpcEmployeeAttributes = req.body;
        const grpcResponse = await employeeGrpcClient.updateEmployee(employeeAttributes);
        if (isGRPCStatus(grpcResponse)) throw grpcErrorTranslator(grpcResponse);

        res.send(grpcResponse);
    }
);

export { router as updateEmployeeRouter };
