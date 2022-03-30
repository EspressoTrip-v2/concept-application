import express, { Request, Response } from "express";
import { LogCodes } from "@espressotrip-org/concept-common";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";
import { LocalLogger } from "../utils";
import {GrpcEmployeeDashClient} from "../services";

const router = express.Router();

router.get("/api/auth/google/redirect", async (req: Request, res: Response) => {
    try {
        const googleUser: GoogleGrpcUser = req.session?.grant.response.profile;

        /** Make the request to the gRPC auth-service server */
        const rpcResponse = await GrpcEmployeeDashClient.getClient().loginGoogleUser(googleUser);
        /** Log Event */
        LocalLogger.log(LogCodes.INFO, `Google SignIn`, "employee-dash/employee-dash-api/src/routes/google-auth.ts:17", `email: ${googleUser.email}`);

        /** Add to the session */
        req.session = {
            payload: rpcResponse.jwt,
        };

        res.render("redirect");
    } catch (error) {
        res.render("error");
    }
});

export { router as googleAuthRouter };
