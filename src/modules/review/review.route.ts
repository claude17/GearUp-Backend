import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.get("/", reviewController.getAllReviews);

router.get("/gear/:gearItemId", reviewController.getReviewsByGear);

router.get("/:id", reviewController.getSingleReview);

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

router.patch("/:id", auth(Role.CUSTOMER), reviewController.updateReview);

router.delete("/:id", auth(Role.CUSTOMER), reviewController.deleteReview);

export const reviewRoutes = router;