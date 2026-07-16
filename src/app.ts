import express, { Application, Request, Response } from "express";
import config from "./config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { userRoutes } from "./modules/user/user.route";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));


app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("GearUp Dev");
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gears", gearRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);

app.use(globalErrorHandler);

export default app;