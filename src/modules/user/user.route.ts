import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();


router.get("/", auth(Role.ADMIN), userController.getAllUser);

router.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER), userController.getMyProfile);

router.patch("/profile", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), userController.updateMyProfile);

router.delete("/profile", auth(Role.CUSTOMER, Role.PROVIDER), userController.deleteUser);

router.patch("/:id", auth(Role.ADMIN), userController.updateUserStatus);

export const userRoutes = router;