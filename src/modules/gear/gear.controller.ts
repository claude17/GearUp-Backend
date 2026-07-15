import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { gearService } from "./gear.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user?.id as string;

    const payload = req.body;

    const gear = await gearService.createGearIntoDB(providerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Gear added successfully",
        data: {
            gear
        }
    });

});

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gear = await gearService.getAllGearFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear fetched successfully",
        data: {
            gear
        }
    });
});

const getSingleGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.id as string;

    if (!gearId) {
        throw new Error("GearId is required in params");
    }

    const gear = await gearService.getSingleGearFromDB(gearId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear fetched successfully",
        data: {
            gear
        }
    });
});

const updateMyGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const gearId = req.params.id as string;

    if (!gearId) {
        throw new Error("GearId is required in params");
    }
    const providerId = req.user?.id as string;
    const payload = req.body;

    const gear = await gearService.updateGearIntoDB(gearId, providerId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear updated successfully",
        data: {
            gear
        }
    });
});

const deleteMyGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const gearId = req.params.id as string;
    const providerId = req.user?.id as string;

    if (!gearId) {
        throw new Error("GearId is required in params");
    }

    await gearService.deleteGearFromDB(gearId, providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Gear deleted successfully",
        data: null
    });
});

const getMyGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id as string;
    const gear = await gearService.getMyGearFromDB(providerId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All gear fetched successfully",
        data: {
            gear
        }
    });
});

export const gearController = {
    createGear,
    getAllGear,
    getSingleGear,
    updateMyGear,
    deleteMyGear,
    getMyGear
};