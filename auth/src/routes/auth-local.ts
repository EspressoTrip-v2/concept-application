import express from "express";
import passport from "passport";

const router = express.Router();

router.post(
    "/api/user/local",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
);

export { router as localAuthRouter };
