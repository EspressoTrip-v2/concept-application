import express, { Request, Response } from "express";
import { requireAuth } from "@espressotrip-org/concept-common";
import { employeeGrpcClient } from "../services";

const router = express.Router();

router.get("/api/employee/:employeeId", requireAuth, async (req: Request, res: Response) => {
    const id = <string>req.query.employeeId;
    const grpcResponse = await employeeGrpcClient.getEmployee(id);
    res.send(grpcResponse);
});

export { router as getEmployeeRouter };
