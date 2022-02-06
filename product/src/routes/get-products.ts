import express, { Response, Request } from "express";
import { requireAuth } from "@espressotrip-org/concept-common";

const router = express.Router();

router.get("/api/product" ,async (req: Request, res: Response) => {
    res.send({status: 'success'})
});

export {router as getProductsRouter}
