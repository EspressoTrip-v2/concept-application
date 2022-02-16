import Joi from "joi";

export const localUserSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.boolean().required(),
});
