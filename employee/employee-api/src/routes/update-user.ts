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
import { updateUserSchema } from "../payload-schemas";
import { userGrpcClient } from "../services";
import { grpcUser } from "../services/proto/userPackage/grpcUser";

const router = express.Router();

router.patch(
    "/api/auth/user/:id",
    validateCurrentUser,
    requireAuth,
    requiredRoles(UserRoles.ADMIN),
    payloadValidation(updateUserSchema),
    async (req: Request, res: Response) => {
        const { id } = req.params;

        /** Create the gRPC user object */
        const updateUser: grpcUser = {
            ...req.body,
            id,
        };

        /** Make the request to the gRPC auth-service server */
        const rpcResponse = await userGrpcClient.updateUser(updateUser);
        if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);
        res.send(rpcResponse);
    }
);

export { router as updateUserRouter };
