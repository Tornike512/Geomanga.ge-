import { api } from "@/lib/api-client";
import type { LoginRequest, Token } from "@/types/user.types";

export const login = async (credentials: LoginRequest): Promise<Token> => {
  const response = await api.post<Token>("/auth/login", credentials);
  // Backend now sets HttpOnly cookies automatically
  return response;
};
