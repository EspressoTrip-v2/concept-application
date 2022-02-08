import express, { Request, Response } from "express";
import { NotFoundError, payloadValidation, requireAuth, requiredRoles, UserRoles, validateCurrentUser } from "@espressotrip-org/concept-common";
import { User, UserUpdateAttrs } from "../models";
import { updateUserSchema } from "../payload-schemas";

const router = express.Router();

router.patch(
    "/api/auth/user/:id",
    validateCurrentUser,
    requireAuth,
    requiredRoles(UserRoles.SUPER),
    payloadValidation(updateUserSchema),
    async (req: Request, res: Response) => {
        const userId = req.params;
        const userUpdate: UserUpdateAttrs = req.body;

        const user = await User.findOne({ id: userId });
        if (!user) throw new NotFoundError("User not found");
        user.set(userUpdate);

        await user.save();

        res.send(user);
    }
);

export { router as updateUserRouter };
