// import { logger } from "../../config/logger.config.js";
import { Permissions, Roles } from "../../../generated/prisma/index.js";
import { AppError } from "../../utils/errors/AppError.js";
import { generateSessionId, hashRefreshToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/helpers/jwt.helper.js";
import { comparePassword, hashPassword } from "../../utils/helpers/password.helper.js";
import { JWTPayload } from "../../utils/types/types.js";
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
            userId: newUser.id,
            sessionId
        });

        const refreshToken = signRefreshToken({
            userId: newUser.id,
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
            user: newUser,
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
            userId: existingUser.id,
            sessionId
        });

        const refreshToken = signRefreshToken({
            userId: existingUser.id,
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

    async getLoggedInUser(user: {
        userId: string;
        sessionId: string;
    }): Promise<{
        user: UserResponseType;
    }> {
        const { userId } = user;

        const loggedInUser = await this.authRepo.findUserByUserId(userId);

        if (!loggedInUser) {
            throw new AppError(404, "User not found");
        }

        return {
            user: loggedInUser
        };
    }

    async refreshSession(refreshToken: string, userAgent: string, ipAddress: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        if (!refreshToken) {
            throw new AppError(401, "Refresh token missing");
        }

        let decoded: JWTPayload;

        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new AppError(401, "Invalid or expired token");
        }

        const { userId, sessionId } = decoded;

        const session = await this.authRepo.findSessionBySessionId(sessionId);

        if (!session) {
            throw new AppError(401, "Session not found");
        }

        if (session.userId !== userId) {
            throw new AppError(401, "Invalid session");
        }

        if (session.isRevoked) {
            throw new AppError(401, "Session revoked");
        }

        if (session.expiredAt <= new Date()) {
            throw new AppError(401, "Session expired");
        }

        const hashedRefreshToken = hashRefreshToken(refreshToken);

        const isHashedRefreshTokenValid = hashedRefreshToken === session.refreshTokenHash;

        // refresh token reuse detected
        if (!isHashedRefreshTokenValid) {
            await this.authRepo.revokeAllUserSession(userId);
            throw new AppError(401, "Refresh token reuse detected");
        }

        const newAccessToken = signAccessToken({
            userId,
            sessionId
        });

        const newRefreshToken = signRefreshToken({
            userId,
            sessionId
        });

        const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);

        const isRotated = await this.authRepo.updateSession(sessionId, hashedRefreshToken, userId, {
            refreshTokenHash: hashedNewRefreshToken,
            userAgent,
            ipAddress,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // atomicity
        // If update failed, another request may have already rotated this refresh token
        if (!isRotated) {
            throw new AppError(401, "Refresh token already used or invalid");
        }

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    async logout(refreshToken: string): Promise<boolean> {
        if (!refreshToken) {
            throw new AppError(401, "Refresh token missing");
        }

        let decoded: JWTPayload;

        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new AppError(401, "Invalid or expired token");
        }

        const { userId, sessionId } = decoded;

        return await this.authRepo.revokeSession(userId, sessionId);
    }

    async logoutAll(userId: string): Promise<boolean> {
        return await this.authRepo.revokeAllUserSession(userId);
    }

    // RBAC
    async getUserRolesAndPermissions(userId: string): Promise<{
        user: {
            id: string;
            email: string;
        };
        roles: Roles[];
        permissions: Permissions[];
    }> {
        const user = await this.authRepo.getUserRolesAndPermissions(userId);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        // logger.info({user});

        // extract roles
        const roles = user.userRoles.map((userRole) => (
            userRole.role.name
        ));

        // extract permissions
        const permissions = user.userRoles.flatMap((userRole) => (
            userRole.role.rolePermissions.map((rolePermission) => (
                rolePermission.permission.name
            ))
        ));

        const uniquePermissions = [...new Set(permissions)];

        return {
            user: {
                id: user.id,
                email: user.email
            },
            roles,
            permissions: uniquePermissions
        };
    }
}