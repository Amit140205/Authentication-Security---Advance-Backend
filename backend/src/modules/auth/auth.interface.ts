import { Session, User } from "../../../generated/prisma/index.js";
import { createSessionType, createUserType, UserResponseType } from "./auth.types.js";

export interface IAuthRepository {
    // user
    findUserByEmail(email: string): Promise<User | null>;

    findUserByUserId(userId: string): Promise<UserResponseType | null>;

    createUser(data: createUserType): Promise<UserResponseType>;

    // session
    createSession(data: createSessionType): Promise<Session>;
}