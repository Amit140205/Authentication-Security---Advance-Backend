import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import prisma from "../../lib/prisma.js";
import { Permissions } from "../../../generated/prisma/index.js";
// import { logger } from "../../config/logger.config.js";

export const authorizationMiddleware = (requiredPermissions: Permissions[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const { user } = req;

            if (!user) {
                return next(new AppError(401, "Unauthorized"));
            }

            const currentUser = await prisma.user.findUnique({
                where: {
                    id: user.userId
                },
                include: {
                    userRoles: {
                        include: {
                            role: {
                                include: {
                                    rolePermissions: {
                                        include: {
                                            permission: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (!currentUser) {
                return next(new AppError(404, "User not found"));
            }

            // logger.info(currentUser);

            // extract all permissions
            const permissions = currentUser.userRoles.flatMap((userRole) => (
                userRole.role.rolePermissions.map((rolePermission) => (
                    rolePermission.permission.name
                ))
            ));

            const uniquePermissions = [...new Set(permissions)];

            const hasPermissions = requiredPermissions.every((permissions) => (
                uniquePermissions.includes(permissions)
            ));

            if (!hasPermissions) {
                return next(new AppError(403, "Forbidden"));
            }

            next();

        } catch (error) {
            return next(error);
        }
    };
};