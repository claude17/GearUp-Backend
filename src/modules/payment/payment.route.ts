import express from "express";

import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = express.Router();

router.post("/checkout", auth(Role.CUSTOMER), paymentController.createCheckoutSession);

router.post("/webhook", paymentController.stripeWebhook);


router.get("/",auth(Role.CUSTOMER),paymentController.getMyPayments);


router.get("/:id",auth(Role.CUSTOMER),paymentController.getSinglePayment);

export const paymentRoutes = router;