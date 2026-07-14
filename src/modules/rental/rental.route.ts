import { Router } from "express";

import { rentalController } from "./rental.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalController.createRental);

router.get("/", auth(Role.CUSTOMER), rentalController.getMyRentals);


router.get("/admin", auth(Role.ADMIN), rentalController.getAllRentals);


router.get("/:id", auth(Role.CUSTOMER), rentalController.getSingleRental);


router.get("/provider/orders", auth(Role.PROVIDER), rentalController.getProviderOrders);

router.patch("/provider/orders/:id", auth(Role.PROVIDER), rentalController.updateRentalStatus);




export const rentalRoutes = router;