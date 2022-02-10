import Joi from "joi";
import { Types } from "mongoose";
import { Categories } from "@espressotrip-org/concept-common";

export function validObjectId(value: string | Types.ObjectId): Types.ObjectId {
    const validId = Types.ObjectId.isValid(value.toString());
    if (!validId) throw new Error("Invalid ObjectId.");
    return new Types.ObjectId(value);
}

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3),
    userRole: Joi.string(),
    categories: Joi.array().items(Categories),
    password: Joi.string().allow(null),
    providerId: Joi.string().allow(null),
});
