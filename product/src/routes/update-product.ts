import express, { Response, Request } from "express";
import { createProductSchema, updateProductSchema } from "../payload-schemas";
import { NotFoundError, payloadValidation, ProductMsg, requireAuth } from "@espressotrip-org/concept-common";
import { rabbitClient } from "../rabbitmq-client";
import { Product } from "../models";
import { UpdateProductPublisher } from "../events/publishers/update-product-publisher";

const router = express.Router();

router.post("/api/product", requireAuth, payloadValidation(updateProductSchema), async (req: Request, res: Response) => {
    const updatedProduct = req.body;

    /** Update product */
    const product = await Product.findOne(updatedProduct.id)
    if (!product) throw new NotFoundError("Product not found");
    product.set(req.body);
    await product.save();

    /** Publish event */
    await new UpdateProductPublisher(rabbitClient.connection).publish(product);

    res.send(product);
});

export { router as updateProductRouter };
