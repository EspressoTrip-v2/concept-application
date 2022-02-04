import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/auth/login-success", (req: Request, res: Response) => {
    if (req.user && req.isAuthenticated()) {
        return res.send({user: req.user, cookie: req.headers.cookie });
    }
    res.send(false);
});

export { router as checkLogInRouter };
