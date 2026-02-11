import { api } from "@/lib/api-client";
import type { Token } from "@/types/user.types";

interface GoogleAuthPayload {
  id_token: string;
  access_token?: string;
}

export const googleAuth = async (
  payload: GoogleAuthPayload,
): Promise<Token> => {
  const response = await api.post<Token>("/auth/google", payload);
  return response;
};
