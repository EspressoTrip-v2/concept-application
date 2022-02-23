import { EmployeeDoc } from "../models";
import jwt from "jsonwebtoken";
import { encryptPayload } from "@espressotrip-org/concept-common";

export function generateJwt(user: EmployeeDoc): string {
    const encryptedPayload = encryptPayload(user, process.env.JWT_KEY!);
    return jwt.sign(encryptedPayload, process.env.JWT_KEY!);
}
