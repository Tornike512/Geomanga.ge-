import { api } from "@/lib/api-client";

export interface ForgotPasswordVerifyData {
  email: string;
  otp_code: string;
}

export interface ForgotPasswordVerifyResponse {
  message: string;
}

export async function forgotPasswordVerify(
  data: ForgotPasswordVerifyData,
): Promise<ForgotPasswordVerifyResponse> {
  return api.post<ForgotPasswordVerifyResponse>(
    "/auth/forgot-password-verify",
    data,
  );
}
