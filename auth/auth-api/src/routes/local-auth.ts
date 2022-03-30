import express, { Request, Response } from "express";
import { LogCodes, payloadValidation } from "@espressotrip-org/concept-common";
import { LocalGrpcUser } from "../services/proto/userPackage/LocalGrpcUser";
import { localUserSchema } from "../payload-schemas";
import { LocalLogger } from "../utils";
import { GrpcAuthClient } from "../services";

const router = express.Router();

router.post("/api/auth/local", payloadValidation(localUserSchema), async (req: Request, res: Response) => {
    const localUser: LocalGrpcUser = req.body;

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await GrpcAuthClient.getClient().loginLocalUser(localUser);

    /** Log Event */
    LocalLogger.log(LogCodes.INFO, `Local SignIn`, "auth/auth-api/src/routes/local-auth.ts:17", `email: ${localUser.email}`);

    /** Add to the session */
    req.session = {
        payload: rpcResponse.jwt,
    };

    res.send({ session: req.get("cookie") });
});

export { router as localAuthRouter };
