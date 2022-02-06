import express, { Request, Response } from "express";
import { BadRequestError, GitHubAuthProfile, GoogleAuthProfile, NotFoundError, SignInTypes } from "@espressotrip-org/concept-common";
import { User, UserDoc } from "../models";
import { generateJwt } from "../services/generate-jwt";
import { CreateUserPublisher } from "../events/publishers";
import { rabbitClient } from "../rabbitmq-client";
const router = express.Router();

router.get("/api/auth/github/redirect", async (req: Request, res: Response) => {
    const gitHubUser: GitHubAuthProfile = req.session?.grant.response.profile;
    if (!gitHubUser) throw new NotFoundError("Github user not found");

    let user: UserDoc | null = await User.findOne({ email: gitHubUser.email });

    /** Check if the user is a valid GitHub account */
    if(user && (user.signInType !== SignInTypes.GITHUB || user.providerId !== gitHubUser.id.toString() ))  throw new BadRequestError(`User already has a ${user.signInType.toUpperCase()} account.`);

    /** Create a new user if not found */
    if (!user) {
        user = User.build(User.buildUserFromGitHub(gitHubUser));
        await user.save();
        await new CreateUserPublisher(rabbitClient.connection).publish(user)
    }

    /** Generate the JWT */
    const userJwt = generateJwt(user as UserDoc);
    req.session = {
        jwt: userJwt,
    };
    res.redirect(301, process.env.BASE_URI!);
});

export { router as gitHubAuthRouter };
