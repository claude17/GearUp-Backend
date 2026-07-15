// src/modules/auth/auth.controller.ts

import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;
    const user = await authService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: {
            user
        }
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const { accessToken } = await authService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 //24 hours or 1 day
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: { accessToken }
    });


});


export const authController = {
    register,
    login
};