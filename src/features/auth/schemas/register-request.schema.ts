import { z } from "zod";

export const registerRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, "მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
      .max(50, "მომხმარებლის სახელი არ უნდა აღემატებოდეს 50 სიმბოლოს")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "მომხმარებლის სახელი უნდა შეიცავდეს მხოლოდ ასოებს, ციფრებს და ქვედა ტირეს",
      ),
    email: z.string().email("გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტა"),
    gender: z.enum(["male", "female"], {
      message: "გთხოვთ, აირჩიოთ სქესი",
    }),
    password: z
      .string()
      .min(8, "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს")
      .max(100, "პაროლი არ უნდა აღემატებოდეს 100 სიმბოლოს"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirmPassword"],
  });

export type RegisterRequestFormData = z.infer<typeof registerRequestSchema>;
