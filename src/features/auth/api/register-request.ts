import { api } from "@/lib/api-client";

export interface RegisterRequestData {
  email: string;
  username: string;
  password: string;
  gender: "male" | "female";
}

export interface RegisterRequestResponse {
  message: string;
  email: string;
  expires_in_minutes: number;
}

export async function registerRequest(
  data: RegisterRequestData,
): Promise<RegisterRequestResponse> {
  return api.post<RegisterRequestResponse>(
    "/api/v1/auth/register-request",
    data,
  );
}
