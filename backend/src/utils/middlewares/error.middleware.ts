import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { env } from "../../config/env.config.js";

export const globalErrorHandler = (err: Error & Partial<AppError>, _req: Request, res: Response, _next: NextFunction) => {

    const message = err.message;
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    const stack = err.stack;

    if (env.NODE_ENVIRONMENT === "development") {
        return res.status(statusCode).json({
            status: status,
            message: message,
            stack: stack,
            err
        });
    }

    if (err.isOperational) {
        return res.status(statusCode).json({
            status: status,
            message: message
        });
    }

    return res.status(500).json({
        status: "error",
        message: "something went wrong"
    });
};