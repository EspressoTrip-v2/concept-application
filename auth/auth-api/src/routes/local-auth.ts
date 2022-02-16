import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, payloadValidation } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../clients";
import { LocalGrpcUser } from "../clients/proto/userPackage/LocalGrpcUser";
import { localUserSchema } from "../payload-schemas";

const router = express.Router();

router.post("/api/auth/local", payloadValidation(localUserSchema), async (req: Request, res: Response) => {
    const localUser: LocalGrpcUser = req.body;

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginLocalUser(localUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    res.send({ session: req.get("cookie") });
});

export { router as localAuthRouter };
