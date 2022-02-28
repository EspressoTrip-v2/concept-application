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
import { createEmployeeSchema } from "../payload-schemas";
import { employeeGrpcClient } from "../services";
import { GrpcEmployeeAttributes } from "../services/proto/employeePackage/GrpcEmployeeAttributes";

const router = express.Router();

router.post(
    "/api/employee",
    requireAuth,
    requiredRoles(UserRoles.ADMIN),
    payloadValidation(createEmployeeSchema),
    async (req: Request, res: Response) => {
        const employeeAttributes: GrpcEmployeeAttributes = req.body;
        const grpcResponse = await employeeGrpcClient.updateEmployee(employeeAttributes);
        if (isGRPCStatus(grpcResponse)) throw grpcErrorTranslator(grpcResponse);

        res.send(grpcResponse);
    }
);

export { router as createEmployeeRouter };
