import { z } from "zod";

export const forgotPasswordRequestSchema = z
  .object({
    email: z.string().email("გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტა"),
    new_password: z
      .string()
      .min(8, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს")
      .max(100, "პაროლი არ უნდა აღემატებოდეს 100 სიმბოლოს"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirm_password"],
  });

export type ForgotPasswordRequestFormData = z.infer<
  typeof forgotPasswordRequestSchema
>;
