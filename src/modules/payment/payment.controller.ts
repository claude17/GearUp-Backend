import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const customerId = req.user?.id as string;

        const payload = req.body;

        const session = await paymentService.createCheckoutSessionIntoDB(
            customerId,
            payload
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Checkout session created successfully",
            data: {
                session
            }
        });
    }
);

const getMyPayments = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const customerId = req.user?.id as string;

        const payments = await paymentService.getMyPaymentsFromDB(customerId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payments fetched successfully",
            data: {
                payments
            }
        });
    }
);

const getSinglePayment = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const paymentId = req.params.id as string;

        const customerId = req.user?.id as string;

        const payment = await paymentService.getSinglePaymentFromDB(
            paymentId,
            customerId
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment fetched successfully",
            data: {
                payment
            }
        });
    }
);

const stripeWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]! as string;

    await paymentService.handleStripeWebhook(event, signature);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook triggered successfully",
        data: null
    });

});

export const paymentController = {
    createCheckoutSession,
    getMyPayments,
    getSinglePayment,
    stripeWebhook
};