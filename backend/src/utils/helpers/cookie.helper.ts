import { Response } from "express";
import { env } from "../../config/env.config.js";

export const setCookies = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENVIRONMENT === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/v1/auth/refresh"
        
        //With path: '/api/v1/auth/refresh', the browser 
        // will strictly attach the refreshToken cookie only 
        // to requests hitting that exact endpoint
        
        // link: https://chatgpt.com/c/6b067d9d-2ba8-83e8-9fa6-8d017e8b741c
    });
};