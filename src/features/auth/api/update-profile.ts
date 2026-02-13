import { api } from "@/lib/api-client";
import type { User, UserUpdate } from "@/types/user.types";

export const updateProfile = async (userData: UserUpdate): Promise<User> => {
  return api.put<User>("/users/me", userData, {
    requiresAuth: true,
  });
};
