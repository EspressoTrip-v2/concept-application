import express, { Response, Request } from "express";
import { createProductSchema } from "../payload-schemas";
import { MongooseError, payloadValidation, requireAuth } from "@espressotrip-org/concept-common";
import { CreateProductPublisher } from "../events";
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
    await product.save().catch(error => {
        if (error) throw new MongooseError(error.message);
    });
    await new CreateProductPublisher(rabbitClient.connection).publish(Product.toPublisherMessage(product));

    res.send(product);
});

export { router as createProductRouter };
