import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, LogCodes, LogPublisher, MicroServiceNames, NotFoundError, rabbitClient } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";

const BASE_URI = process.env.DEV_UI_REDIRECT || process.env.BASE_URI!;
const router = express.Router();

router.get("/api/auth/google/redirect", async (req: Request, res: Response) => {
    const logger = LogPublisher.getPublisher(rabbitClient.connection, MicroServiceNames.AUTH_API, "auth-api:google-auth");
    const googleUser: GoogleGrpcUser = req.session?.grant.response.profile;
    if (!googleUser) throw new NotFoundError("Google user not found");

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginGoogleUser(googleUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);

    /** Log Event */
    logger.publish(LogCodes.INFO, `Google SignIn`, "/api/auth/google/redirect", `email: ${googleUser.email}`);

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    /** Redirect to home page */
    res.redirect(301, BASE_URI);
});

export { router as googleAuthRouter };
