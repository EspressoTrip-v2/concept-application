import { LocalDone, LocalFunction, LocalOptions } from "@espressotrip-org/concept-common";
import { SignInTypes, User } from "../models";
import { CreateUserPublisher } from "../events/publishers/create-user-publisher";
import { rabbitClient } from "../rabbitmq-client";

export const localFunction: LocalFunction = async function (username: string, password: string, done: LocalDone) {
    try {
        let user = await User.findOne({ email: username, signInType: SignInTypes.LOCAL });
        if (user) {
            return done(null, user);
        } else {
            user = new User(User.buildUserFromLocal({ email: username, password }));
            await user.save();

            /** Publish create user event */
            await new CreateUserPublisher(rabbitClient.connection).publish(user);
        }
        return done(null, user);
    } catch (error) {
        console.error(`[local:auth]: Error authorizing user ${(error as Error).message}`);
        done(error as Error);
    }
};

export const localOptions: LocalOptions = {
    passwordField: "password",
    usernameField: "email",
};
