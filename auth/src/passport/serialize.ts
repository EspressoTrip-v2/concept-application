import { SerializeDone, SerializeFunc } from "@espressotrip-org/concept-common";
import { UserSessionId } from "../models";

export const passportSerialize: SerializeFunc<UserSessionId> =  function (user: Express.User, done: SerializeDone<UserSessionId>): void {
    done(null, user as UserSessionId);
};
