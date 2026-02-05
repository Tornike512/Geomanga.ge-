import { z } from "zod";

export const forgotPasswordVerifySchema = z.object({
  otp_code: z
    .string()
    .length(4, "კოდი უნდა შეიცავდეს 4 ციფრს")
    .regex(/^\d+$/, "კოდი უნდა შეიცავდეს მხოლოდ ციფრებს"),
});

export type ForgotPasswordVerifyFormData = z.infer<
  typeof forgotPasswordVerifySchema
>;
