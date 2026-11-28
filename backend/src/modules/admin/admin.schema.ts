import z from "zod";
import { Permissions, Roles } from "../../../generated/prisma/index.js";

const ALL_PERMISSIONS = Object.values(Permissions);
const ALL_ROLES = Object.values(Roles);

export const roleIdParamsSchema = z.object({
    roleId: z.uuid()
}).strict();

export const createRoleSchema = z.object({
    name: z.enum(ALL_ROLES, "Invalid role name"),

    permissions: z.array(z.enum(ALL_PERMISSIONS))
        .min(1, "At least one permission must be assigned")
        .max(ALL_PERMISSIONS.length, `Cannot assign more than ${ALL_PERMISSIONS.length} permissions`)
        .refine(
            (permissions) => new Set(permissions).size === permissions.length,
            {
                "message": "Duplicate permissions are not allowed"
            }
        )
}).strict();

export const updateRolePermissionsSchema = z.object({
    permissions: z.array(z.enum(ALL_PERMISSIONS))
        .max(ALL_PERMISSIONS.length, `Cannot assign more than ${ALL_PERMISSIONS.length} permissions`)
        .refine(
            (permissions) => new Set(permissions).size === permissions.length,
            {
                "message": "Duplicate permissions are not allowed"
            }
        )
}).strict();

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRolePermissionsDTO = z.infer<typeof updateRolePermissionsSchema>;