import { api } from "@/lib/api-client";

export interface ForgotPasswordResendResponse {
  message: string;
  email: string;
  expires_in_minutes: number;
}

export async function forgotPasswordResend(
  email: string,
): Promise<ForgotPasswordResendResponse> {
  return api.post<ForgotPasswordResendResponse>(
    `/auth/forgot-password-resend?email=${encodeURIComponent(email)}`,
  );
}
