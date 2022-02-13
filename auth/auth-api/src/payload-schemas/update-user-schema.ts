import Joi from "joi";
import { Categories } from "@espressotrip-org/concept-common";

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3),
    userRole: Joi.string(),
    categories: Joi.array().items(Categories),
    password: Joi.string().allow(null),
    providerId: Joi.string().allow(null),
});
