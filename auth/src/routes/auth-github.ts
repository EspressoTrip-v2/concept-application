import passport from "passport";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/auth/github", passport.authenticate("github", { scope: ["profile"] }));
router.get("/api/auth/github/redirect", passport.authenticate("github", { scope: ["profile"] }), (req: Request, res: Response) => {
    /** Redirect to the home page */
    res.redirect("/");
});

export { router as githubAuthRouter };
