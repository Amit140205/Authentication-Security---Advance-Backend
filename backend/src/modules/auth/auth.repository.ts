import { Session, User } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import { createSessionType, createUserType } from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async createUser(data: createUserType): Promise<User> {
        return await prisma.user.create({
            data
        });
    }

    async createSession(data: createSessionType): Promise<Session> {
        return await prisma.session.create({
            data
        });
    }
}