import { User } from "../../../generated/prisma/index.js";
import { AllRolesWithPayloadType, RoleWithPayloadType } from "./admin.type.js";

export interface IAdminRepository {
    getAllUsers(): Promise<User[]>;

    getAllRoles(): Promise<AllRolesWithPayloadType[]>;

    getRoleByRoleId(roleId: string): Promise<RoleWithPayloadType | null>;
}