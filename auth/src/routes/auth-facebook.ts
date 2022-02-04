import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

router.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["profile"] }));
router.get("/api/auth/facebook/redirect", passport.authenticate("facebook", { scope: ["profile"] }), (req: Request, res: Response) => {
    /** Redirect to the home page */
    res.redirect("/");
});

export { router as facebookAuthRouter };
