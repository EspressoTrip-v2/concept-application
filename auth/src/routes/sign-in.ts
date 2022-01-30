import express, { Request, Response } from "express";
import passport from "passport";
import GoogleStrategy from 'passport-google-oauth'

const router = express.Router();

router.post("/api/user/signin", (req: Request, res: Response) => {
    res.render(`<h1>Sign in</h1>
<a class="button google" href="/login/federated/accounts.google.com">Sign in with Google</a>`);
});

export { router as signInRouter };
