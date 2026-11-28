import { Permissions, Role, Roles, User } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../utils/errors/AppError.js";
import { ROLE_ASSIGNABLE_PERMISSIONS } from "./admin.constant.js";
import { IAdminRepository } from "./admin.interface.js";
import { AllRolesWithPayloadType, RoleWithPayloadType, UpdatedRolePermissionsPayloadType } from "./admin.type.js";

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

    async createRoleWithPermissions(name: Roles, permissions: Permissions[]): Promise<Role> {
        return await prisma.$transaction(async (tx) => {
            const existingRole = await tx.role.findUnique({
                where: {
                    name
                }
            });

            if (existingRole) {
                throw new AppError(400, "Role already exists");
            }

            const allowedPermissions = ROLE_ASSIGNABLE_PERMISSIONS[name];

            if (!allowedPermissions) {
                throw new AppError(400, "Permissions cannot be assigned to this role");
            }

            const invalidPermissions = permissions.filter((permission) => !allowedPermissions.includes(permission));

            if (invalidPermissions.length > 0) {
                throw new AppError(400, `These permissions cannot be assigned to ${name}: ${invalidPermissions.join(", ")}`);
            }

            const permissionRecords = await tx.permission.findMany({
                where: {
                    name: {
                        in: permissions
                    }
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (permissionRecords.length !== permissions.length) {
                throw new AppError(500, "Some permissions are missing from the database");
            }

            // creating the new role
            const newRole = await tx.role.create({
                data: {
                    name
                }
            });

            await tx.rolePermission.createMany({
                data: permissionRecords.map((permission) => ({
                    roleId: newRole.id,
                    permissionId: permission.id
                }))
            });

            return newRole;
        });
    }

    async updateRolePermissions(roleId: string, permissions: Permissions[]): Promise<UpdatedRolePermissionsPayloadType | null> {
        return await prisma.$transaction(async (tx) => {
            const existingRole = await tx.role.findUnique({
                where: {
                    id: roleId
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (!existingRole) {
                throw new AppError(404, "Role not found");
            }

            if (existingRole.name === "SUPER_ADMIN") {
                throw new AppError(400, "SUPER ADMIN role permissions cannot be modified");
            }

            const allowedPermissions = ROLE_ASSIGNABLE_PERMISSIONS[existingRole.name];

            if (!allowedPermissions) {
                throw new AppError(400, "Permissions cannot be assigned to this role");
            }

            const invalidPermissions = permissions.filter((permission) => !allowedPermissions.includes(permission));

            if (invalidPermissions.length > 0) {
                throw new AppError(400, `These permissions cannot be assigned to ${existingRole.name}: ${invalidPermissions.join(", ")}`);
            }

            const permissionRecords = await tx.permission.findMany({
                where: {
                    name: {
                        in: permissions
                    }
                },
                select: {
                    id: true,
                    name: true
                }
            });

            if (permissionRecords.length !== permissions.length) {
                throw new AppError(500, "Some permissions are missing from the database");
            }

            // remove the existing permissions
            await tx.rolePermission.deleteMany({
                where: {
                    roleId
                }
            });

            if (permissionRecords.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissionRecords.map((permission) => ({
                        roleId,
                        permissionId: permission.id
                    }))
                });
            }

            const updatedRole = await tx.role.findUnique({
                where: {
                    id: roleId
                },
                select: {
                    id: true,
                    name: true,
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
                }
            });

            return updatedRole;
        });
    }
}