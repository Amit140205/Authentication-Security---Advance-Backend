import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./utils/middlewares/error.middleware.js";
import { AppError } from "./utils/errors/AppError.js";

export const app = express();

// app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));
// limited payload
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

import authRouter from "./modules/auth/auth.route.js";

app.use("/api/v1/auth", authRouter);

app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);