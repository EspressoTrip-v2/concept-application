import express, { Response, Request } from "express";
import { createProductSchema } from "../payload-schemas";
import { payloadValidation, requireAuth } from "@espressotrip-org/concept-common";

const router = express.Router();

router.post("/api/products", payloadValidation(createProductSchema), (req: Request, res: Response) => {
    res.send({status: 'success'});
});

export { router as createProductRouter };
