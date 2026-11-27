import { User } from "../../../generated/prisma/index.js";
import { AppError } from "../../utils/errors/AppError.js";
import { IAdminRepository } from "./admin.interface.js";
import { toAllRolesResponse, toRoleResponse } from "./admin.mapper.js";
import { ReturnAllRolesType, ReturnRoleType } from "./admin.type.js";

export class AdminService {
    constructor(private adminRepo: IAdminRepository) { }

    async getAllUsers(): Promise<{
        users: User[];
    }> {
        const users = await this.adminRepo.getAllUsers();

        return {
            users
        };
    }

    async getAllRoles(): Promise<{
        roles: ReturnAllRolesType
    }> {
        const roles = await this.adminRepo.getAllRoles();

        return {
            roles: toAllRolesResponse(roles)
        }
    }

    async getRoleByRoleId(roleId: string): Promise<{
        role: ReturnRoleType
    }> {
        const role = await this.adminRepo.getRoleByRoleId(roleId);

        if (!role) {
            throw new AppError(404, "Role not found");
        }

        return {
            role: toRoleResponse(role)
        };
    }
}