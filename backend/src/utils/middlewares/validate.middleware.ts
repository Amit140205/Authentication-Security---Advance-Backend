import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { AppError } from "../errors/AppError.js";
import { ValidateTarget } from "../types/types.js";

// making validate middleware dynamic
// it can validate "body" | "params" | "query"

export const validate = (schema: ZodObject<any>, target: ValidateTarget = "body") => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const data = req[target];
        const result = schema.safeParse(data);

        if (!result.success) {
            const errors = result.error.issues.map((err) => ({
                field: err.path.join(""),
                message: err.message
            }));

            throw new AppError(
                400,
                errors.map((err) => (`${err.field}: ${err.message}`)).join(", ")
            );
        }

        req[target] = result.data;
        next();
    };
};