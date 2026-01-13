import { api } from "@/lib/api-client";
import type { PasswordUpdate } from "@/types/user.types";

export const updatePassword = async (
  data: PasswordUpdate,
): Promise<{ message: string }> => {
  return api.put<{ message: string }>("/auth/me/password", data, {
    requiresAuth: true,
  });
};
