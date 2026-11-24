import { z } from "zod";

export const registerUserSchema = z.object({
    email: z.email("Invalid email").trim().toLowerCase(),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(12, "Password too long"),
    confirmPassword: z.string()
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        path: ["confirmPassword"],
        message: "Passwords do not match"
    }
).strict();

export const loginUserSchema = z.object({
    email: z.email("Invalid email").trim().toLowerCase(),
    password: z.string()
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;