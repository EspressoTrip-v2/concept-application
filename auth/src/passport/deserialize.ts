import { DeserializeDone, DeserializeFunc, MongooseError } from "@espressotrip-org/concept-common";
import { User, UserSessionId } from "../models";

export const passportDeserialize: DeserializeFunc<UserSessionId> = async function (user: UserSessionId, done: DeserializeDone): Promise<void> {
    const storedUser = await User.findOne({ email: user.email, id: user.id }).catch(error => done(new MongooseError(error.message)));
    if (storedUser) {
        return done(null, user);
    }
    return done(null, false);
};
