import express, { Response, Request } from "express";

const router = express.Router();

router.get("/api/products", (req: Request, res: Response) => {
    res.send({status: 'success'})
});

export {router as getProductsRouter}
