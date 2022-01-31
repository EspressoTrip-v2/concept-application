import Joi from 'joi'
import {Types} from "mongoose";

function validObjectId(value: string | Types.ObjectId): Types.ObjectId {
    const validId = Types.ObjectId.isValid(value.toString());
    if (!validId) throw new Error("Invalid ObjectId.");
    return new Types.ObjectId(value);
}

export const createProductSchema = Joi
.object({
    quantity: Joi.number().required(),
    title: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    orderId: Joi.custom(validObjectId, "Validate objectId").allow(Joi.string(), null),
    userId: Joi.custom(validObjectId, "Validate objectId"),
    itemCode: Joi.string().required(),
})