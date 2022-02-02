import passport from "passport";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/user/github", passport.authenticate("github", { scope: ["profile"] }));

router.get("/api/user/github/redirect", passport.authenticate("github", { scope: ["profile"] }),(req: Request, res: Response) => {
    res.send({ message: "Redirected from GitHub" });
});

export { router as githubAuthRouter };
