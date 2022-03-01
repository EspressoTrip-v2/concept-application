import express, { Request, Response } from "express";
import { requireAuth } from "@espressotrip-org/concept-common";
import { employeeGrpcClient } from "../services";
import { LocalLogger } from "../utils";

const router = express.Router();

router.delete("/api/employee/:employeeId", requireAuth, async (req: Request, res: Response) => {
    const id = <string>req.query.employeeId;
    const grpcResponse = await employeeGrpcClient.deleteEmployee(id);
    res.send(grpcResponse);
});

export { router as deleteEmployeeRouter };
