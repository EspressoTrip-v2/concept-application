import express, { Request, Response } from "express";
import passport from "passport";
import { CreateUserPublisher } from "../events/publishers/create-user-publisher";
import { rabbitClient } from "../rabbitmq-client";

const router = express.Router();

router.post("/api/user/signup", async (req: Request, res: Response) => {
    await new CreateUserPublisher(rabbitClient.connection).publish(req.body)
    res.send(req.body);
});

export { router as signUpRouter };
