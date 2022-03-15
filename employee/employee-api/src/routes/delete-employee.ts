import express, { Request, Response } from "express";
import { requireAuth } from "@espressotrip-org/concept-common";
import { GrpcEmployeeClient } from "../services";

const router = express.Router();

router.delete("/api/employee/:employeeId", requireAuth, async (req: Request, res: Response) => {
    const id = <string>req.params.employeeId;
    const grpcResponse = await GrpcEmployeeClient.getClient().deleteEmployee(id);
    res.send(grpcResponse);
});

export { router as deleteEmployeeRouter };
