import { User } from "../../../generated/prisma/index.js";
import { RegisterUserDTO } from "./auth.schema.js";

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<User | null>;

    createUser(data: RegisterUserDTO): Promise<User>;
}