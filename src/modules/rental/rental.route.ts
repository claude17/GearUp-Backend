import { Router } from "express";
import { rentalController } from "./rental.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalController.createRental);

router.get("/myrental", auth(Role.CUSTOMER), rentalController.getMyRentals);


router.get("/", auth(Role.ADMIN), rentalController.getAllRentals);


router.get("/provider/orders", auth(Role.PROVIDER), rentalController.getProviderOrders);

router.patch("/:id", auth(Role.CUSTOMER, Role.PROVIDER), rentalController.updateRentalStatus);

router.get("/:id", auth(Role.CUSTOMER), rentalController.getSingleRental);


export const rentalRoutes = router;