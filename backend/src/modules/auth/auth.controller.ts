import { Request, Response } from "express";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/helpers/sendResponse.helper.js";
import { catchAsync } from "../../utils/helpers/catchAsync.helper.js";
import { clearCookie, setCookies } from "../../utils/helpers/cookie.helper.js";
import { JWTPayload } from "../../utils/types/types.js";

export const registerUserController = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body, req.headers["user-agent"] as string, req.ip as string);

    setCookies(res, result.refreshToken);

    sendResponse(res, 201, {
        success: true,
        message: "User registered successfully",
        data: {
            user: result.user,
            accessToken: result.accessToken
        }
    });
});

export const loginUserController = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body, req.headers["user-agent"] as string, req.ip as string);

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
        success: true,
        message: "User login successfully",
        data: {
            user: result.user,
            accessToken: result.accessToken
        }
    });
});

export const loggedInUserController = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await authService.getLoggedInUser(user as JWTPayload);

    sendResponse(res, 200, {
        success: true,
        message: "User fetched successfully",
        data: result
    });
});

export const refreshSessionController = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.replace("Bearer ", "");

    const result = await authService.refreshSession(refreshToken as string, req.headers["user-agent"] as string, req.ip as string);

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
        success: true,
        message: "Refresh token rotated successfully",
        data: {
            accessToken: result.accessToken
        }
    });
});

export const logoutController = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.replace("Bearer ", "");

    const result = await authService.logout(refreshToken as string);

    clearCookie(res);

    sendResponse(res, 200, {
        success: true,
        message: result ? "Logged out successfully" : "Already logged out"
    });
});

export const logoutAllController = catchAsync(async (req: Request, res: Response) => {
    const { user } = req;

    const result = await authService.logoutAll(user?.userId as string);

    clearCookie(res);

    sendResponse(res, 200, {
        success: true,
        message: result ? "User logged out of all devices" : "Already logged out"
    });
});