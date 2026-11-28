import { Request, Response } from "express";
import { catchAsync } from "../../utils/helpers/catchAsync.helper.js";
import { sendResponse } from "../../utils/helpers/sendResponse.helper.js";
import { adminService } from "./admin.container.js";

export const getAllUsersController = catchAsync(async (_req: Request, res: Response) => {

    const result = await adminService.getAllUsers();

    sendResponse(res, 200, {
        success: true,
        message: "All users fetched successfully",
        data: result
    });
});

export const getAllRolesController = catchAsync(async (_req: Request, res: Response) => {
    const result = await adminService.getAllRoles();

    sendResponse(res, 200, {
        success: true,
        message: "All roles fetched successfully",
        data: result
    });
});

export const getRoleByRoleIdController = catchAsync(async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const result = await adminService.getRoleByRoleId(roleId as string);

    sendResponse(res, 200, {
        success: true,
        message: "Role fetched successfully",
        data: result
    });
});

export const createRoleWithPermissionsController = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.createRoleWithPermissions(req.body);

    sendResponse(res, 200, {
        success: true,
        message: "Role created successfully with permissions",
        data: result
    });
});

export const updateRolePermissionsController = catchAsync(async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const result = await adminService.updateRolePermissions(roleId as string, req.body);

    sendResponse(res, 200, {
        success: true,
        message: "Role permissions updated successfully",
        data: result
    });
});