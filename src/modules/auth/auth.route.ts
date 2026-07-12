import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER), authController.getMyProfile);

export const authRoutes = router;