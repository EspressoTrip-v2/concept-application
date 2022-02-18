import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, NotFoundError } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../clients";
import { GitHubGrpcUser } from "../clients/proto/userPackage/GitHubGrpcUser";
const BASE_URI = process.env.DEV_UI_REDIRECT || process.env.BASE_URI!
const router = express.Router();

router.get("/api/auth/github/redirect", async (req: Request, res: Response) => {
    const gitHubUser: GitHubGrpcUser = req.session?.grant.response.profile;
    if (!gitHubUser) throw new NotFoundError("Github user not found");

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.loginGitHubUser(gitHubUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);


    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    /** Redirect to home page */
    res.redirect(301, BASE_URI);
});

export { router as gitHubAuthRouter };
