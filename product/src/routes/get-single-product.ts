import express, { Response, Request } from "express";

const router = express.Router();

router.get("/api/products/:id", (req: Request, res: Response) => {
    console.log(req.params);
    res.send({status: 'success'})
});

export {router as getSingleProductRouter}
