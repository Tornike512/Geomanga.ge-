import { api } from "@/lib/api-client";
import type { User } from "@/types/user.types";

interface GoogleAuthPayload {
  id_token: string;
  access_token?: string;
}

export const googleAuth = async (payload: GoogleAuthPayload): Promise<User> => {
  const response = await api.post<User>("/auth/google", payload);
  return response;
};
