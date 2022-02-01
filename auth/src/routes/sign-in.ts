import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/user/signin", async (req: Request, res: Response) => {
    res.send("login");
});

export { router as signInRouter };
