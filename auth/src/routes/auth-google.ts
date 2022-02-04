import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

router.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/api/auth/google/redirect", passport.authenticate("google", { scope: ["profile", "email"] }), (req: Request, res: Response) => {
    /** Redirect to the home page */
    res.redirect("/");
});

export { router as googleAuthRouter };
