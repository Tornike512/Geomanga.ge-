import { z } from "zod";

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
  email: z.string().email("Please enter a valid email").optional(),
  avatar_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  banner_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const privacySettingsSchema = z.object({
  show_uploaded_manga: z.boolean(),
  show_reading_progress: z.boolean(),
  profile_visibility: z.enum(["public", "private"]),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>;
