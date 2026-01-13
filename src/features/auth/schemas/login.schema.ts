import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Email or username is required")
    .max(100, "Login must be less than 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
