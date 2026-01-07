import { api } from "@/lib/api-client";
import type { User, UserCreate } from "@/types/user.types";

export const register = async (userData: UserCreate): Promise<User> => {
  const response = await api.post<User>("/auth/register", userData);
  return response;
};
