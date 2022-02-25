import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, requireAuth, validateCurrentUser } from "@espressotrip-org/concept-common";
import { employeeGrpcClient } from "../services";

const router = express.Router();

router.delete("/api/employee/:employeeId", validateCurrentUser, requireAuth, async (req: Request, res: Response) => {
    const id = <string>req.query.employeeId;
    const grpcResponse = await employeeGrpcClient.deleteEmployee(id);
    if (isGRPCStatus(grpcResponse)) throw grpcErrorTranslator(grpcResponse);

    res.send(grpcResponse);
});

export { router as deleteEmployeeRouter };
