import express, { Response, Request } from "express";
import { createProductSchema } from "../payload-schemas";
import { payloadValidation, requireAuth } from "@espressotrip-org/concept-common";
import { CreateProductPublisher } from "../events";
import { rabbitClient } from "../rabbitmq-client";
import { Product } from "../models";

const router = express.Router();

router.post("/api/product", requireAuth, payloadValidation(createProductSchema), async (req: Request, res: Response) => {
    /* Create product */
    const product = Product.build({
        title: req.body.title,
        category: req.body.category,
        reserved: req.body.reserved,
        tags: req.body.tags,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        itemCode: req.body.itemCode,
        userId: req.currentUser!.id,
    });
    await product.save();

    /** Publish event */
    await new CreateProductPublisher(rabbitClient.connection).publish(product);

    res.send(product);
});

export { router as createProductRouter };
