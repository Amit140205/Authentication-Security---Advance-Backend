import { IAdminRepository } from "./admin.interface.js";

export class AdminService {
    constructor(private adminRepo: IAdminRepository) { }

    async getAllUsers() {
        return await this.adminRepo.getAllUsers();
    }
}