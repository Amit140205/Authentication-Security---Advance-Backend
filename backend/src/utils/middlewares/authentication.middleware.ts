import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../helpers/jwt.helper.js";

export const authenticationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AppError(401, "Authentication required");
        }

        if (!authHeader.startsWith("Bearer")) {
            throw new AppError(401, "Invalid authentication header format");
        }

        const accessToken = authHeader.split(" ")[1];

        if (!accessToken) {
            throw new AppError(401, "Access token required");
        }

        const decoded = verifyAccessToken(accessToken);

        req.user = {
            userId: decoded.userId,
            sessionId: decoded.sessionId
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError(401, "Access token expired"));
        } else if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError(401, "Invalid access token"));
        }

        return next(error);
    }
};