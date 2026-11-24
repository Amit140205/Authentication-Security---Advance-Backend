import { AuthProvider } from "../../../generated/prisma/index.js";

export type UserResponseType = {
    id: string;
    email: string;
    isEmailVerified: boolean;
    provider: AuthProvider;
    createdAt: Date;
};