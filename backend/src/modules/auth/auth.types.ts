import { AuthProvider } from "../../../generated/prisma/index.js";

export type createUserType = {
    email: string;
    passwordHash: string;
};

export type UserResponseType = {
    id: string;
    email: string;
    isEmailVerified: boolean;
    provider: AuthProvider;
    createdAt: Date;
};

export type createSessionType = {
    id: string,
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiredAt: Date;
};
