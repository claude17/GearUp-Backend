import { Router } from "express";



import { gearController } from "./gear.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Public Routes
router.get("/", gearController.getAllGear);

router.get("/:id", gearController.getSingleGear);

// Provider Routes
router.post("/provider", auth(Role.PROVIDER), gearController.createGear);

router.patch("/provider/:id", auth(Role.PROVIDER), gearController.updateGear);

router.delete("/provider/:id", auth(Role.PROVIDER), gearController.deleteGear);

// Admin Routes
// router.get("/admin", auth(Role.ADMIN), gearController.getAdminGear);

export const gearRoutes = router;