import { api } from "@/lib/api-client";

export interface ForgotPasswordRequestData {
  email: string;
  new_password: string;
}

export interface ForgotPasswordRequestResponse {
  message: string;
  email: string;
  expires_in_minutes: number;
}

export async function forgotPasswordRequest(
  data: ForgotPasswordRequestData,
): Promise<ForgotPasswordRequestResponse> {
  return api.post<ForgotPasswordRequestResponse>(
    "/auth/forgot-password-request",
    data,
  );
}
