import Joi from "joi";

export const createEmployeeSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
