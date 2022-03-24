import express, { Request, Response } from "express";
import { requireAuth } from "@espressotrip-org/concept-common";
import { GrpcEmployeeClient } from "../services";

const router = express.Router();

router.get("/api/employee", requireAuth, async (req: Request, res: Response) => {
    const grpcResponse = await GrpcEmployeeClient.getClient().getAllEmployees();
    res.send(grpcResponse);
});

export { router as getAllEmployeeRouter };
