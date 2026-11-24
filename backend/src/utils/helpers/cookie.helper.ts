import { Response } from "express";
import { env } from "../../config/env.config.js";

export const setCookies = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENVIRONMENT === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/v1/auth/refresh"
        
        //With path: '/api/v1/auth/refresh', the browser 
        // will strictly attach the refreshToken cookie only 
        // to requests hitting that exact endpoint
    });
};