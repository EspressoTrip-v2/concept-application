import express, { Request, Response } from "express";
import { LogCodes, NotFoundError } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";
import { LocalLogger } from "../utils";

const BASE_URI = process.env.DEV_UI_REDIRECT || process.env.BASE_URI!;
const router = express.Router();

router.get("/api/auth/google/redirect", async (req: Request, res: Response) => {
    const googleUser: GoogleGrpcUser = req.session?.grant.response.profile;
    if (!googleUser) throw new NotFoundError("Google user not found");

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginGoogleUser(googleUser);

    /** Log Event */
    LocalLogger.log(LogCodes.INFO, `Google SignIn`, "/api/auth/google/redirect", `email: ${googleUser.email}`);

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    /** Redirect to home page */
    res.redirect(301, BASE_URI);
});

export { router as googleAuthRouter };
