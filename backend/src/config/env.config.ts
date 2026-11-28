import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

import { z } from "zod";

const envSchema = z.object({
    NODE_ENVIRONMENT: z.enum([
        "production",
        "development",
        "test"
    ]),
    PORT: z.coerce.number(),
    FRONTEND_URL: z.url(),
    DATABASE_URL: z.url(),
    SALT_ROUNDS: z.coerce.number(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
    SUPER_ADMIN_EMAIL: z.email(),
    SUPER_ADMIN_PASSWORD: z.string().min(8, "Admin password must be at least 8 characters long")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables: ", z.treeifyError(parsedEnv.error).properties);
    process.exit(1);
}

export const env = parsedEnv.data;