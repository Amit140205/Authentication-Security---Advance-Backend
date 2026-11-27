import { AllRolesWithPayloadType, ReturnAllRolesType, ReturnRoleType, RoleWithPayloadType } from "./admin.type.js";

export const toAllRolesResponse = (roles: AllRolesWithPayloadType[]): ReturnAllRolesType => {
    return roles.map((role) => ({
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,

        usersCount: role.userRoles.length,

        permissions: role.rolePermissions.map((rolePermission) => ({
            id: rolePermission.permission.id,
            name: rolePermission.permission.name
        })),

        permissionsCount: role.rolePermissions.length
    }));
};

export const toRoleResponse = (role: RoleWithPayloadType): ReturnRoleType => {
    return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,

        usersCount: role.userRoles.length,
        users: role.userRoles.map((userRole) => ({
            id: userRole.user.id,
            email: userRole.user.email,
            createdAt: userRole.user.createdAt,
            assignedAt: userRole.assignedAt
        })),

        permissions: role.rolePermissions.map((rolePermission) => ({
            id: rolePermission.permission.id,
            name: rolePermission.permission.name,
            assignedAt: rolePermission.assignedAt
        }))
    };
};