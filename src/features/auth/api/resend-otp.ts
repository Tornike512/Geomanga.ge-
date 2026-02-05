import { api } from "@/lib/api-client";

export interface ResendOtpResponse {
  message: string;
  email: string;
  expires_in_minutes: number;
}

export async function resendOtp(email: string): Promise<ResendOtpResponse> {
  return api.post<ResendOtpResponse>(
    `/auth/resend-otp?email=${encodeURIComponent(email)}`,
  );
}
