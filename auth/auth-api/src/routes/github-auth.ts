import express, { Request, Response } from "express";
import { LogCodes } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { GitHubGrpcUser } from "../services/proto/userPackage/GitHubGrpcUser";
import { LocalLogger } from "../utils";

const router = express.Router();

router.get("/api/auth/github/redirect", async (req: Request, res: Response) => {
    try {
        const gitHubUser: GitHubGrpcUser = req.session?.grant.response.profile;

        /** Make the request to the gRPC auth-service server */
        const rpcResponse = await userGrpcClient.loginGitHubUser(gitHubUser);

        /** Log Event */
        LocalLogger.log(LogCodes.INFO, `GitHub SignIn`, "/api/auth/github/redirect", `email: ${gitHubUser.email}`);

        /** Add to the session */
        req.session = {
            payload: rpcResponse.jwt,
        };

        res.render("redirect");
    } catch (error) {
        res.render("error");
    }
});

export { router as gitHubAuthRouter };
