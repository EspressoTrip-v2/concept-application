import express, { Request, Response } from "express";

const router = express.Router()

router.get('/api/user/signout', (req: Request, res: Response)=>{
    res.send('sign-out')
})

export {router as signOutRouter}