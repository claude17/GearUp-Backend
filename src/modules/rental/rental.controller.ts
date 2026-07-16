import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";



const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user?.id as string;
    const payload = req.body;

    const rental = await rentalService.createRentalIntoDB(customerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental order created successfully",
        data: {
            rental
        }
    });
});

const getMyRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user?.id as string;

    const rentals = await rentalService.getMyRentalsFromDB(customerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental orders fetched successfully",
        data: {
            rentals
        }
    });
});

const getSingleRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const rentalId = req.params.id as string;

    const rental = await rentalService.getSingleRentalFromDB(rentalId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental order fetched successfully",
        data: {
            rental
        }
    });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user?.id as string;

    const rentals = await rentalService.getProviderOrdersFromDB(providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Provider orders fetched successfully",
        data: {
            rentals
        }
    });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string;
    const role = req.user!.role;
    const rentalId = req.params.id as string;
    const payload = req.body;

    const rental = await rentalService.updateRentalStatusIntoDB(rentalId, userId, role, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental status updated successfully",
        data: {
            rental
        }
    });
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const rentals = await rentalService.getAllRentalsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All rental orders fetched successfully",
        data: {
            rentals
        }
    });
});

export const rentalController = {
    createRental,
    getMyRentals,
    getSingleRental,
    getProviderOrders,
    updateRentalStatus,
    getAllRentals
};