import { Permissions, Roles } from "../../../generated/prisma/index.js";

export const ROLE_ASSIGNABLE_PERMISSIONS: Partial<Record<Roles, readonly Permissions[]>> = {
    [Roles.ADMIN]: [
        Permissions.CREATE_POSTS,
        Permissions.DELETE_POSTS,
        Permissions.MANAGE_ROLES,
        Permissions.MANAGE_USERS,
        Permissions.VIEW_ANALYTICS,
        Permissions.MANAGE_SETTING
    ],

    [Roles.MODERATOR]: [
        Permissions.CREATE_POSTS,
        Permissions.DELETE_POSTS,
        Permissions.VIEW_ANALYTICS
    ],

    [Roles.EDITOR]: [
        Permissions.CREATE_POSTS,
        Permissions.VIEW_ANALYTICS
    ],

    [Roles.MEMBER]: [
        Permissions.CREATE_POSTS
    ]
}