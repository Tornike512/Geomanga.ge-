import { api, setTokens } from "@/lib/api-client";
import type { Token, UserCreate } from "@/types/user.types";

export const register = async (userData: UserCreate): Promise<Token> => {
  const response = await api.post<Token>("/auth/register", userData);
  setTokens(response.access_token, response.refresh_token);
  return response;
};
