import { api } from "@/lib/api-client";
import type { User } from "@/types/user.types";

export interface RegisterVerifyData {
  email: string;
  otp_code: string;
}

export async function registerVerify(data: RegisterVerifyData): Promise<User> {
  return api.post<User>("/auth/register-verify", data);
}
