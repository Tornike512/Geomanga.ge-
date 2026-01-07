import { API_URL } from "@/config";
import { setTokens } from "@/lib/api-client";
import { ApiError, type ApiErrorResponse } from "@/types/api.types";
import type { Token } from "@/types/user.types";

export interface RegisterData {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly avatar?: File;
}

export const register = async (userData: RegisterData): Promise<Token> => {
  const formData = new FormData();
  formData.append("username", userData.username);
  formData.append("email", userData.email);
  formData.append("password", userData.password);

  if (userData.avatar) {
    formData.append("avatar", userData.avatar);
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    let errorResponse: ApiErrorResponse | undefined;
    try {
      errorResponse = (await response.json()) as ApiErrorResponse;
    } catch {
      // If parsing fails, continue without error details
    }

    const message = errorResponse?.detail ?? response.statusText;
    throw new ApiError(message, response.status, errorResponse);
  }

  const data = (await response.json()) as Token;
  setTokens(data.access_token, data.refresh_token);
  return data;
};
