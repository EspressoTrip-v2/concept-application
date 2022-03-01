import express, { Request, Response } from "express";
import { LogCodes, NotFoundError } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";
import { LocalLogger } from "../utils";

const router = express.Router();
router.get("/api/auth/google/redirect", async (req: Request, res: Response) => {
    const googleUser: GoogleGrpcUser = req.session?.grant.response.profile;

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginGoogleUser(googleUser);

    /** Log Event */
    LocalLogger.log(LogCodes.INFO, `Google SignIn`, "/api/auth/google/redirect", `email: ${googleUser.email}`);

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    /** Redirect to home page */
    res.render('redirect')
});


export { router as googleAuthRouter };
