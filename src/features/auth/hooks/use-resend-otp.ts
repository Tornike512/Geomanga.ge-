import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "../api/resend-otp";

export function useResendOtp() {
  return useMutation({
    mutationFn: (email: string) => resendOtp(email),
  });
}
