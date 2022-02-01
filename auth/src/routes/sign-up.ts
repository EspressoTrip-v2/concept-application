import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

router.post("/api/user/signup", async (req: Request, res: Response) => {
    res.send("sign-up");
});

export { router as signUpRouter };
