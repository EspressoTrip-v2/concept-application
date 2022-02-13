import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, NotFoundError } from "@espressotrip-org/concept-common";
import { GitHubUser } from "../clients/proto/userPackage/GitHubUser";
import { userGrpcClient } from "../clients/grpc-user-client";

const router = express.Router();

router.get("/api/auth/github/redirect", async (req: Request, res: Response) => {
    const gitHubUser: GitHubUser = req.session?.grant.response.profile;
    if (!gitHubUser) throw new NotFoundError("Github user not found");

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.saveGitHubUser(gitHubUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);


    /** Add to the session */
    req.session = {
        userRole: rpcResponse.user?.userRole,
        payload: rpcResponse.jwt,
    };

    /** Redirect to home page */
    res.redirect(301, process.env.BASE_URI!);
});

export { router as gitHubAuthRouter };
