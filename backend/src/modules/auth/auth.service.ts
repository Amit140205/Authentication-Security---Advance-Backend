import { AppError } from "../../utils/errors/AppError.js";
import { generateSessionId, hashRefreshToken, signAccessToken, signRefreshToken } from "../../utils/helpers/jwt.helper.js";
import { comparePassword, hashPassword } from "../../utils/helpers/password.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toUserResponse } from "./auth.mapper.js";
import { LoginUserDTO, RegisterUserDTO } from "./auth.schema.js";
import { UserResponseType } from "./auth.types.js";

export class AuthService {
    constructor(private authRepo: IAuthRepository) { }

    async registerUser(data: RegisterUserDTO, userAgent: string, ipAddress: string): Promise<{
        user: UserResponseType;
        accessToken: string;
        refreshToken: string;
    }> {
        const { email, password } = data;
        const existingUser = await this.authRepo.findUserByEmail(email);

        if (existingUser) {
            throw new AppError(400, "User with this email already exists!");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await this.authRepo.createUser({ email, passwordHash: hashedPassword });

        const sessionId = generateSessionId();

        const accessToken = signAccessToken({
            sub: newUser.id,
            sessionId
        });

        const refreshToken = signRefreshToken({
            sub: newUser.id,
            sessionId
        });

        const hashedRefreshToken = hashRefreshToken(refreshToken);

        await this.authRepo.createSession({
            id: sessionId,
            userId: newUser.id,
            refreshTokenHash: hashedRefreshToken,
            userAgent,
            ipAddress,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return {
            user: toUserResponse(newUser),
            accessToken,
            refreshToken
        };
    }

    async loginUser(data: LoginUserDTO, userAgent: string, ipAddress: string): Promise<{
        user: UserResponseType;
        accessToken: string;
        refreshToken: string;
    }> {
        const { email, password } = data;
        const existingUser = await this.authRepo.findUserByEmail(email);

        if (!existingUser || !existingUser.passwordHash) {
            throw new AppError(401, "Invalid credentials");
        }

        const isPasswordCorrect = await comparePassword(password, existingUser.passwordHash);

        if (!isPasswordCorrect) {
            throw new AppError(401, "Invalid credentials");
        }

        const sessionId = generateSessionId();

        const accessToken = signAccessToken({
            sub: existingUser.id,
            sessionId
        });

        const refreshToken = signRefreshToken({
            sub: existingUser.id,
            sessionId
        });

        const hashedRefreshToken = hashRefreshToken(refreshToken);

        await this.authRepo.createSession({
            id: sessionId,
            userId: existingUser.id,
            refreshTokenHash: hashedRefreshToken,
            userAgent,
            ipAddress,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return {
            user: toUserResponse(existingUser),
            accessToken,
            refreshToken
        };
    }
}