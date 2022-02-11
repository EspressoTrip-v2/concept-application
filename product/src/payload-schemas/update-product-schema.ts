import Joi from "joi";
import { Categories } from "@espressotrip-org/concept-common";
import { validObjectId } from "./valid-object-Id";

export const updateProductSchema = Joi.object({
    id: Joi.custom(validObjectId, "Validate objectId"),
    quantity: Joi.number(),
    category: Joi.array().items(Categories),
    tags: Joi.array().items(Joi.string()),
    title: Joi.string(),
    price: Joi.number(),
    description: Joi.string(),
    orderId: Joi.custom(validObjectId, "Validate objectId").allow(Joi.string(), ''),
    itemCode: Joi.string(),
});
