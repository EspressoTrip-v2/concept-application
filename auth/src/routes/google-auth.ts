import express, { Request, Response } from "express";
import { User, UserDoc } from "../models";
import { BadRequestError, GoogleAuthProfile, NotFoundError, SignInTypes } from "@espressotrip-org/concept-common";
import { generateJwt } from "../services/generate-jwt";
import { CreateUserPublisher } from "../events/publishers";
import { rabbitClient } from "../rabbitmq-client";

const router = express.Router();

router.get("/api/auth/google/redirect", async (req: Request, res: Response) => {
    const googleUser: GoogleAuthProfile = req.session?.grant.response.profile;
    if (!googleUser) throw new NotFoundError("Google user not found");

    let user: UserDoc | null = await User.findOne({ email: googleUser.email });

    /** Check if the user is a valid Google account */
    if (user && (user.signInType !== SignInTypes.GOOGLE || user.providerId !== googleUser.sub))
        throw new BadRequestError(`User already has a ${user.signInType.toUpperCase()} account.`);

    /** Create a new user if not found */
    if (!user) {
        user = User.build(User.buildUserFromGoogle(googleUser));
        await user.save();
        await new CreateUserPublisher(rabbitClient.connection).publish(user)
    }
    /** Generate the JWT */
    const userJwt = generateJwt(user);
    req.session = {
        jwt: userJwt,
    };
    res.redirect(301, process.env.BASE_URI!);
});

export { router as googleAuthRouter };
