import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus } from "@espressotrip-org/concept-common";
import { LocalUser } from "../clients/proto/userPackage/LocalUser";
import { userGrpcClient } from "../clients/grpc-user-client";

const router = express.Router();

router.post("/api/auth/local", async (req: Request, res: Response) => {
    const localUser: LocalUser = req.body;

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.saveLocalUser(localUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);

    /** Add to the session */
    req.session = {
        userRole: rpcResponse.user?.userRole,
        payload: rpcResponse.jwt,
    };

    res.send({ session: req.get("cookie") });
});

export { router as localAuthRouter };
