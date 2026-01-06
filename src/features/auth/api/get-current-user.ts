import { api } from "@/lib/api-client";
import type { User } from "@/types/user.types";

export const getCurrentUser = async (): Promise<User> => {
  return api.get<User>("/auth/me", { requiresAuth: true });
};
