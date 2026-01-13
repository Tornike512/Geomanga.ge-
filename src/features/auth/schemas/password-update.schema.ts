import { z } from "zod";

export const passwordUpdateSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "Current password is required")
      .max(100, "Password must be less than 100 characters"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;
