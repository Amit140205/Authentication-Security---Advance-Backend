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

    async findSessionBySessionId(sessionId: string): Promise<Session | null> {
        return await prisma.session.findUnique({
            where: {
                id: sessionId
            }
        });
    }

    async revokeAllUserSession(userId: string): Promise<boolean> {
        const result = await prisma.session.updateMany({
            where: {
                userId,
                isRevoked: false
            },
            data: {
                isRevoked: true,
                revokedAt: new Date()
            }
        });

        return result.count > 0;
    }

    async updateSession(sessionId: string, oldRefreshTokenHash: string, userId: string, data: {
        refreshTokenHash: string;
        userAgent?: string;
        ipAddress?: string;
        expiredAt: Date;
    }): Promise<boolean> {
        const result = await prisma.session.updateMany({
            where: {
                id: sessionId,
                userId,
                refreshTokenHash: oldRefreshTokenHash,
                isRevoked: false,
                expiredAt: {
                    gt: new Date()
                }
            },
            data
        });

        return result.count === 1;
    }

    async revokeSession(userId: string, sessionId: string): Promise<boolean> {
        const result = await prisma.session.updateMany({
            where: {
                id: sessionId,
                userId,
                isRevoked: false
            },
            data: {
                isRevoked: true,
                revokedAt: new Date()
            }
        });

        return result.count === 1;
    }
}