import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/auth/signout", (req: Request, res: Response) => {
    req.session = null
    res.send({ user: false, cookie: req.session });
});

export { router as signOutRouter };
