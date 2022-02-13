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
import { UserModel } from "../clients/proto/userPackage/UserModel";
import { userGrpcClient } from "../clients/grpc-user-client";

const router = express.Router();

router.patch(
    "/api/auth/user/:id",
    validateCurrentUser,
    requireAuth,
    requiredRoles(UserRoles.SUPER),
    payloadValidation(updateUserSchema),
    async (req: Request, res: Response) => {
        const { id } = req.params;

        /** Create the gRPC user object */
        const updateUser: UserModel = {
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
