import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/auth/signout", (req: Request, res: Response) => {
    req.logout();
    res.send({ user: false, cookie: req.headers.cookie });
});

export { router as signOutRouter };
