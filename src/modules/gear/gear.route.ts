import { Router } from "express";



import { gearController } from "./gear.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.get("/", gearController.getAllGear);

router.post("/mygear", auth(Role.PROVIDER), gearController.getMyGear);

router.get("/:id", gearController.getSingleGear);

router.post("/", auth(Role.PROVIDER), gearController.createGear);

router.patch("/:id", auth(Role.PROVIDER), gearController.updateMyGear);

router.delete("/:id", auth(Role.PROVIDER), gearController.deleteMyGear);

export const gearRoutes = router;