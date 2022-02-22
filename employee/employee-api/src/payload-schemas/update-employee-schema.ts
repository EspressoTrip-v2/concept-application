import Joi from "joi";

export const updateEmployeeSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
