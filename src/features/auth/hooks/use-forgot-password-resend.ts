import { useMutation } from "@tanstack/react-query";
import { forgotPasswordResend } from "../api/forgot-password-resend";

export function useForgotPasswordResend() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordResend(email),
  });
}
