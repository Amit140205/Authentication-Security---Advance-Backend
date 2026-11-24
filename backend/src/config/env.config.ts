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
    SALT_ROUNDS: z.coerce.number()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables: ", z.treeifyError(parsedEnv.error).properties);
    process.exit(1);
}

export const env = parsedEnv.data;