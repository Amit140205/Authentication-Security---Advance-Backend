import { User } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IAdminRepository } from "./admin.interface.js";
import { AllRolesWithPayloadType, RoleWithPayloadType } from "./admin.type.js";

export class AdminRepository implements IAdminRepository {
    async getAllUsers(): Promise<User[]> {
        return await prisma.user.findMany({});
    }

    async getAllRoles(): Promise<AllRolesWithPayloadType[]> {
        return await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,

                userRoles: {
                    select: {
                        userId: true
                    }
                },

                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });
    }

    async getRoleByRoleId(roleId: string): Promise<RoleWithPayloadType | null> {
        return await prisma.role.findUnique({
            where: {
                id: roleId
            },
            select: {
                id: true,
                name: true,
                createdAt: true,

                userRoles: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                createdAt: true
                            }
                        },
                        assignedAt: true
                    }
                },

                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        assignedAt: true
                    }
                }
            }
        });
    }
}