import { Permissions, Role, Roles, User } from "../../../generated/prisma/index.js";
import { AllRolesWithPayloadType, RoleWithPayloadType, UpdatedRolePermissionsPayloadType } from "./admin.type.js";

export interface IAdminRepository {
    getAllUsers(): Promise<User[]>;

    getAllRoles(): Promise<AllRolesWithPayloadType[]>;

    getRoleByRoleId(roleId: string): Promise<RoleWithPayloadType | null>;

    createRoleWithPermissions(name: Roles, permissions: Permissions[]): Promise<Role>;

    updateRolePermissions(roleId: string, permissions: Permissions[]): Promise<UpdatedRolePermissionsPayloadType | null>;
}