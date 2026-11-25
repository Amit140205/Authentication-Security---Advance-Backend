import { Session, User } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import { createSessionType, createUserType, UserResponseType } from "./auth.types.js";

export class AuthRepository implements IAuthRepository {

    // user

    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async findUserByUserId(userId: string): Promise<UserResponseType | null> {
        return await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                isEmailVerified: true,
                provider: true,
                createdAt: true
            }
        });
    }

    async createUser(data: createUserType): Promise<UserResponseType> {
        return await prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                isEmailVerified: true,
                provider: true,
                createdAt: true
            }
        });
    }

    // session

    async createSession(data: createSessionType): Promise<Session> {
        return await prisma.session.create({
            data
        });
    }
}