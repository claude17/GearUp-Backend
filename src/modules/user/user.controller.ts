import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";


const getAllUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const profiles = await userService.getAllUserFromDB();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profiles fetched successfully",
            data: {
                profiles
            }
        });

    }
);

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id as string;

    const payload = req.body;

    const user = await userService.updateUserStatusIntoDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: {
            user
        }
    });

}
);

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string;
    const profile = await userService.getMyProfileFromDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: {
            profile
        }
    });
});


const updateMyProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.user?.id as string;

        const payload = req.body;

        const profile = await userService.updateMyProfileIntoDB(
            userId,
            payload
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile updated successfully",
            data: {
                profile
            }
        });

    }
);

const deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.user?.id as string;

        await userService.deleteUserFromDB(userId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile deleted successfully",
            data: null
        });

    }
);

export const userController = {
    getAllUser,
    getMyProfile,
    updateUserStatus,
    updateMyProfile,
    deleteUser
};