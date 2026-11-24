import { User } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { AppError } from "../../utils/errors/AppError.js";
import { hashPassword } from "../../utils/helpers/password.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { RegisterUserDTO } from "./auth.schema.js";

export class AuthRepository implements IAuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async createUser(data: RegisterUserDTO): Promise<User> {
        return await prisma.$transaction(async (tx) => {
            const { email, password } = data;
            const existingUser = await tx.user.findUnique({
                where: {
                    email
                }
            });

            if (existingUser) {
                throw new AppError(400, "User with this email already exists!");
            }

            const hashedPassword = await hashPassword(password);

            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword
                }
            });

            return newUser;
        });
    }
}