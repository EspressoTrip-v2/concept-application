import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, LogClientOptions, LogCodes, LogPublisher, MicroServiceNames, payloadValidation, rabbitClient } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { LocalGrpcUser } from "../services/proto/userPackage/LocalGrpcUser";
import { localUserSchema } from "../payload-schemas";

const router = express.Router();

/** Logging Options */
const LOG_OPTIONS: LogClientOptions = {
    serviceName: MicroServiceNames.AUTH_API,
    publisherName: "auth-api-local-auth:route",
};

router.post("/api/auth/local", payloadValidation(localUserSchema), async (req: Request, res: Response) => {
    const logger = LogPublisher.getPublisher(rabbitClient.connection, LOG_OPTIONS);
    const localUser: LocalGrpcUser = req.body;

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginLocalUser(localUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);

    /** Log Event */
    logger.publish({
        service: MicroServiceNames.AUTH_API,
        logContext: LogCodes.INFO,
        message: `Local SignIn`,
        details: `email: ${localUser.email}`,
        origin: "/api/auth/local",
        date: new Date().toISOString(),
    });

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    res.send({ session: req.get("cookie") });
});

export { router as localAuthRouter };
