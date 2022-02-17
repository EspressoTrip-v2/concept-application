import Joi from "joi";

export const localUserSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
