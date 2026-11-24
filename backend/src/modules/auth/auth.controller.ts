import { Request, Response } from "express";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/helpers/sendResponse.helper.js";
import { catchAsync } from "../../utils/helpers/catchAsync.helper.js";

export const registerUserController = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);

    sendResponse(res, 201, {
        success: true,
        message: "User registered successfully",
        data: result
    });
});