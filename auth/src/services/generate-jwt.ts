import { UserDoc } from "../models";
import jwt from "jsonwebtoken";

export function generateJwt(user: UserDoc): string {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            userRoles: user.userRoles,
        },
        process.env.JWT_KEY!
    );
}
