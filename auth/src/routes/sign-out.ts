import express, { Request, Response } from "express";

const router = express.Router()

router.post('/api/user/signout', (req: Request, res: Response)=>{
    res.render('sign-out')
})

export {router as signOutRouter}