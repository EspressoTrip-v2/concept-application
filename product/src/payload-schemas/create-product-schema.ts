import Joi from "joi";
import { Types } from "mongoose";
import { Categories } from "@espressotrip-org/concept-common";

function validObjectId(value: string | Types.ObjectId): Types.ObjectId {
    const validId = Types.ObjectId.isValid(value.toString());
    if (!validId) throw new Error("Invalid ObjectId.");
    return new Types.ObjectId(value);
}

export const createProductSchema = Joi.object({
    id: Joi.custom(validObjectId, "Validate objectId"),
    quantity: Joi.number().required(),
    category: Joi.array().items(Categories).required(),
    tags: Joi.array().items(Joi.string()).required(),
    title: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    orderId: Joi.custom(validObjectId, "Validate objectId").allow(Joi.string(), ''),
    itemCode: Joi.string().required(),
});
