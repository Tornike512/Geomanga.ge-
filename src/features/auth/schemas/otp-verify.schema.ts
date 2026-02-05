import { z } from "zod";

export const otpVerifySchema = z.object({
  otp_code: z
    .string()
    .length(4, "კოდი უნდა შედგებოდეს 4 ციფრისგან")
    .regex(/^\d{4}$/, "კოდი უნდა შეიცავდეს მხოლოდ ციფრებს"),
});

export type OtpVerifyFormData = z.infer<typeof otpVerifySchema>;
