import { User } from "../../../generated/prisma/index.js";
import { UserResponseType } from "./auth.type.js";

export const toUserResponse = (user: User): UserResponseType => {
    return {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        provider: user.provider,
        createdAt: user.createdAt
    };
}; 