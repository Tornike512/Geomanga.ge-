import { api } from "@/lib/api-client";
import type { User, UserUpdate } from "@/types/user.types";

export const updateProfile = async (userData: UserUpdate): Promise<User> => {
  return api.put<User>("/api/v1/users/me", userData, {
    requiresAuth: true,
  });
};
