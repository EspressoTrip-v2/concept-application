import express, { Request, Response } from "express";
import { requireAuth, requiredRoles, UserRoles } from "@espressotrip-org/concept-common";
import { GrpcEmployeeClient } from "../services";

const router = express.Router();

router.get("/api/employee/:employeeId", requireAuth, requiredRoles(UserRoles.ADMIN), async (req: Request, res: Response) => {
    const id = <string>req.params.employeeId;
    const grpcResponse = await GrpcEmployeeClient.getClient().getEmployee(id);
    res.send(grpcResponse);
});

export { router as getEmployeeRouter };
