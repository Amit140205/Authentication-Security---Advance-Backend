import { Role, User } from "../../../generated/prisma/index.js";
import { AppError } from "../../utils/errors/AppError.js";
import { IAdminRepository } from "./admin.interface.js";
import { toAllRolesResponse, toRoleResponse } from "./admin.mapper.js";
import { CreateRoleDTO, UpdateRolePermissionsDTO } from "./admin.schema.js";
import { ReturnAllRolesType, ReturnRoleType, UpdatedRolePermissionsPayloadType } from "./admin.type.js";

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
        roles: ReturnAllRolesType;
    }> {
        const roles = await this.adminRepo.getAllRoles();

        return {
            roles: toAllRolesResponse(roles)
        };
    }

    async getRoleByRoleId(roleId: string): Promise<{
        role: ReturnRoleType;
    }> {
        const role = await this.adminRepo.getRoleByRoleId(roleId);

        if (!role) {
            throw new AppError(404, "Role not found");
        }

        return {
            role: toRoleResponse(role)
        };
    }

    async createRoleWithPermissions(data: CreateRoleDTO): Promise<{
        role: Role;
    }> {
        const { name, permissions } = data;
        const role = await this.adminRepo.createRoleWithPermissions(name, permissions);

        return {
            role
        };
    }

    async updateRolePermissions(roleId: string, data: UpdateRolePermissionsDTO): Promise<{
        role: UpdatedRolePermissionsPayloadType | null
    }> {
        const { permissions } = data;

        const updatedRole = await this.adminRepo.updateRolePermissions(roleId, permissions);

        return {
            role: updatedRole
        };
    }
}