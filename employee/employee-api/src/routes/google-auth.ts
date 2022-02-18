import express, { Request, Response } from "express";
import { grpcErrorTranslator, isGRPCStatus, NotFoundError } from "@espressotrip-org/concept-common";
import { userGrpcClient } from "../services";
import { GoogleGrpcUser } from "../services/proto/userPackage/GoogleGrpcUser";

const router = express.Router();

router.get("/api/auth/google/redirect", async (req: Request, res: Response) => {
    const googleUser: GoogleGrpcUser = req.session?.grant.response.profile;
    if (!googleUser) throw new NotFoundError("Google user not found");

    /** Make the request to the gRPC auth-service server */
    const rpcResponse = await userGrpcClient.saveGoogleUser(googleUser);
    if (isGRPCStatus(rpcResponse)) throw grpcErrorTranslator(rpcResponse);


    /** Add to the session */
    req.session = {
        userRole: rpcResponse.user?.userRole,
        payload: rpcResponse.jwt,
    };

    /** Redirect to home page */
    res.redirect(301, process.env.BASE_URI!);
});

export { router as googleAuthRouter };
