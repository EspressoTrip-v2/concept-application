import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/user/facebook", (req: Request, res: Response) => {
    res.send({ message: "Facebook auth not allowed in develop env" });
});

router.get("/api/user/facebook/redirect", (req: Request, res: Response) => {
    res.send({ message: "Redirected from Facebook" });
});

export { router as facebookAuthRouter };
