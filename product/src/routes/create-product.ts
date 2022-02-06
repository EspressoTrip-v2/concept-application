import express, { Response, Request } from "express";
import { createProductSchema } from "../payload-schemas";
import { MongooseError, payloadValidation, requireAuth } from "@espressotrip-org/concept-common";
import { CreateProductPublisher } from "../events";
import { rabbitClient } from "../rabbitmq-client";
import { Product } from "../models";

const router = express.Router();

router.post("/api/product", payloadValidation(createProductSchema), async (req: Request, res: Response) => {

    /* Create product */
    const product = Product.build({
        title: req.body.title,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        itemCode: req.body.itemCode,
        // @ts-ignore
        userId: req.user.id
    });
    await product.save().catch(error => {
        if (error) throw new MongooseError(error.message);
    });

    /** Publish event */
    await new CreateProductPublisher(rabbitClient.connection).publish(Product.toPublisherMessage(product));

    res.send(product);
});

export { router as createProductRouter };
