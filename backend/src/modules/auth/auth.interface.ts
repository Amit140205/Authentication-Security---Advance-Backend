import { Session, User } from "../../../generated/prisma/index.js";
import { createSessionType, createUserType } from "./auth.types.js";

export interface IAuthRepository {
    // user
    findUserByEmail(email: string): Promise<User | null>;

    createUser(data: createUserType): Promise<User>;

    // session
    createSession(data: createSessionType): Promise<Session>;
}