import { env } from "../../config/env.config.js";
import { JWTPayload } from "../types/types.js";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export const signAccessToken = (payload: JWTPayload): string => {
    return jwt.sign(
        payload,
        env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
        }
    );
};

export const signRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(
        payload,
        env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
        }
    );
};

export const verifyAccessToken = (token: string): JWTPayload => {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JWTPayload;
};

export const hashRefreshToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateSessionId = () => {
    return crypto.randomUUID();
};