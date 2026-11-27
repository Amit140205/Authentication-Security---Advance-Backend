import z from "zod";

export const getRoleIdSchema = z.object({
    roleId: z.uuid()
}).strict();