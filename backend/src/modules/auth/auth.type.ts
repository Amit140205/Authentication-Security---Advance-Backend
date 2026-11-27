import { AuthProvider, Prisma } from "../../../generated/prisma/index.js";

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

export type UserWithPayloadType = Prisma.UserGetPayload<{
    select: {
        id: true;
        email: true;

        userRoles: {
            select: {
                role: {
                    select: {
                        id: true;
                        name: true;
                        rolePermissions: {
                            select: {
                                permission: {
                                    select: {
                                        id: true;
                                        name: true;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
}>;
