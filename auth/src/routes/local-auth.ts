import express, { Request, Response } from "express";
import { User, UserDoc } from "../models";
import { BadRequestError, NotAuthorizedError, NotFoundError, SignInTypes } from "@espressotrip-org/concept-common";
import { Password } from "../services";
import { generateJwt } from "../services/generate-jwt";
import { CreateUserPublisher } from "../events/publishers";
import { rabbitClient } from "../rabbitmq-client";

const router = express.Router();

router.post("/api/auth/local", async (req: Request, res: Response) => {
    const { name, email, password, type } = req.body;

    /** Preliminarily tries to find user and validate password if sign in */
    /* type = true (sign up) / type = false (sign in) */
    let user: UserDoc | null = await User.findOne({ email });
    if (user && !type && user.password) if (!(await Password.compare(user.password, password))) throw new NotAuthorizedError();

    /** User does not exist and sign in */
    if (!user && !type) throw new NotFoundError("User not found");

    /** User exists but type is different to local */
    if (user  && user.signInType !== SignInTypes.LOCAL) throw new BadRequestError(`User already has a ${user.signInType.toUpperCase()} account.`);

    /* Create a user if sign up and user has not been found */
    if (!user && type) {
        user = User.build(User.buildUserFromLocal({ name, email, password }));
        await user.save();
        await new CreateUserPublisher(rabbitClient.connection).publish(user)
    }

    /** Generate the JWT */
    const userJwt = generateJwt(user!);
    req.session = {
        jwt: userJwt,
    };

    /** Create teh user session object */
    const userSession = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        userRole: user?.userRole,
    };


    res.send({ user: userSession, cookie: req.get('cookie') });
});

export { router as localAuthRouter };
