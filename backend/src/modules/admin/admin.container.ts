import { AdminRepository } from "./admin.repository.js";
import { AdminService } from "./admin.service.js";

const adminRepository = new AdminRepository();
export const adminService = new AdminService(adminRepository);