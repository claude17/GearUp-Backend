import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";



const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user?.id as string;

    const payload = req.body;

    const review = await reviewService.createReviewIntoDB(customerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: {
            review
        }
    });

});

const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const reviews = await reviewService.getAllReviewsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews fetched successfully",
        data: {
            reviews
        }
    });

});

const getReviewsByGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const gearItemId = req.params.gearItemId as string;

    const reviews = await reviewService.getReviewsByGearFromDB(gearItemId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear reviews fetched successfully",
        data: {
            reviews
        }
    });

});

const getSingleReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const reviewId = req.params.id as string;

    const review = await reviewService.getSingleReviewFromDB(reviewId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Review fetched successfully",
        data: {
            review
        }
    });

});

const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const reviewId = req.params.id as string;

    const customerId = req.user?.id as string;

    const payload = req.body;

    const review = await reviewService.updateReviewIntoDB(reviewId, customerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Review updated successfully",
        data: {
            review
        }
    });

});

const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const reviewId = req.params.id as string;

    const customerId = req.user?.id as string;

    await reviewService.deleteReviewFromDB(reviewId, customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Review deleted successfully",
        data: null
    });

});

export const reviewController = {
    createReview,
    getAllReviews,
    getReviewsByGear,
    getSingleReview,
    updateReview,
    deleteReview
};