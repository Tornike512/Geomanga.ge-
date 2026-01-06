import { api, setTokens } from "@/lib/api-client";
import type { LoginRequest, Token } from "@/types/user.types";

export const login = async (credentials: LoginRequest): Promise<Token> => {
  const response = await api.post<Token>("/auth/login", credentials);
  setTokens(response.access_token, response.refresh_token);
  return response;
};
