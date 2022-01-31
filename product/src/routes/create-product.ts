import express, { Response, Request } from "express";
import { createProductSchema } from "../payload-schemas";
import { payloadValidation, requireAuth } from "@espressotrip-org/concept-common";
import { CreateProductPublisher } from "../events/publishers/create-product-publisher";
import { rabbitClient } from "../rabbitmq-client";
import { Product } from "../models";

const router = express.Router();

router.post("/api/product", requireAuth, payloadValidation(createProductSchema), async (req: Request, res: Response) => {
    const product = Product.build({
        title: req.body.title,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        itemCode: req.body.itemCode,
        userId: req.currentUser?.id!,
    });
    await product.save();
    await new CreateProductPublisher(rabbitClient.connection).publish(Product.toPublisherMessage(product));

    res.send(product);
});

export { router as createProductRouter };
