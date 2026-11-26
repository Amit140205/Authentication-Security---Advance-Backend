import { Request, Response } from "express";
import { catchAsync } from "../../utils/helpers/catchAsync.helper.js";
import { sendResponse } from "../../utils/helpers/sendResponse.helper.js";
import { adminService } from "./admin.container.js";

export const getAllUsersController = catchAsync(async (_req: Request, res: Response) => {

    const result = await adminService.getAllUsers();

    sendResponse(res, 200, {
        success: true,
        message: "User fetched successfully",
        data: {
            users: result
        }
    });
});