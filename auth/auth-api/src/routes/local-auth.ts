import express, { Request, Response } from "express";
import {
    grpcErrorTranslator,
    isGRPCStatus,
    LogCodes,
    LogPublisher,
    MicroServiceNames,
    payloadValidation,
    rabbitClient,
} from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { LocalGrpcUser } from "../services/proto/userPackage/LocalGrpcUser";
import { localUserSchema } from "../payload-schemas";

const router = express.Router();

router.post("/api/auth/local", payloadValidation(localUserSchema), async (req: Request, res: Response) => {
    const logger = LogPublisher.getPublisher(rabbitClient.connection, MicroServiceNames.AUTH_API, "auth-api:local-auth");
    const localUser: LocalGrpcUser = req.body;

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginLocalUser(localUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);

    /** Log Event */
    logger.publish(LogCodes.INFO, `Local SignIn`, "/api/auth/local", `email: ${localUser.email}`);

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    res.send({ session: req.get("cookie") });
});

export { router as localAuthRouter };
