import { Prisma } from "../../../generated/prisma/index.js";

export type AllRolesWithPayloadType = Prisma.RoleGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;

        userRoles: {
            select: {
                userId: true
            };
        },

        rolePermissions: {
            select: {
                permission: {
                    select: {
                        id: true;
                        name: true;
                    };
                };
            };
        };
    },
}>;

export type RoleWithPayloadType = Prisma.RoleGetPayload<{
    select: {
        id: true;
        name: true;
        createdAt: true;

        userRoles: {
            select: {
                user: {
                    select: {
                        id: true;
                        email: true;
                        createdAt: true;
                    };
                };
                assignedAt: true;
            };
        },

        rolePermissions: {
            select: {
                permission: {
                    select: {
                        id: true;
                        name: true;
                    };
                };
                assignedAt: true;
            };
        };
    },
}>;

export type ReturnAllRolesType = {
    id: string;
    name: string;
    createdAt: Date;
    usersCount: number;
    permissions: {
        id: string;
        name: string;
    }[];
    permissionsCount: number;
}[];

export type ReturnRoleType = {
    id: string;
    name: string;
    createdAt: Date;
    usersCount: number;
    users: {
        id: string;
        email: string;
        createdAt: Date;
        assignedAt: Date;
    }[];
    permissions: {
        id: string;
        name: string;
        assignedAt: Date;
    }[];
}