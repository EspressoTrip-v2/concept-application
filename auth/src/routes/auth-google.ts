import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

router.get("/api/user/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/api/user/google/redirect", passport.authenticate("google", { scope: ["profile"] }), (req: Request, res: Response) => {
    const { code } = req.query;
    res.send({ message: "Redirected from Google" });
});

export { router as googleAuthRouter };
