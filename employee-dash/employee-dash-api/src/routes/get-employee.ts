import express, { Request, Response } from "express";
import { requireAuth } from "@espressotrip-org/concept-common";
import { GrpcEmployeeDashClient } from "../services";

const router = express.Router();

router.get("/api/employee/:employeeId", requireAuth, async (req: Request, res: Response) => {
    const id = <string>req.params.employeeId;
    const grpcResponse = await GrpcEmployeeDashClient.getClient().getEmployee(id);
    res.send(grpcResponse);
});

export { router as getEmployeeRouter };
