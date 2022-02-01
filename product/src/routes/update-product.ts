import express, { Response, Request } from "express";
import { createProductSchema } from "../payload-schemas";
import { MongooseError, NotFoundError, payloadValidation, requireAuth } from "@espressotrip-org/concept-common";
import { rabbitClient } from "../rabbitmq-client";
import { Product } from "../models";
import { UpdateProductPublisher } from "../events/publishers/update-product-publisher";

const router = express.Router();

router.post("/api/product", requireAuth, payloadValidation(createProductSchema), async (req: Request, res: Response) => {
    const updatedProduct = req.body;

    /** Update product */
    const product = await Product.findOne(updatedProduct.id).catch(error => {
        if (error) throw new MongooseError(error.message);
    });
    if (!product) throw new NotFoundError("Product not found");
    product.set(req.body);
    await product.save();

    /** Publish event */
    await new UpdateProductPublisher(rabbitClient.connection).publish(Product.toPublisherMessage(product));

    res.send(product);
});

export { router as updateProductRouter };
