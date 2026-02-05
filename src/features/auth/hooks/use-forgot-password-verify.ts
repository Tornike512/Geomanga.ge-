import { useMutation } from "@tanstack/react-query";
import {
  type ForgotPasswordVerifyData,
  forgotPasswordVerify,
} from "../api/forgot-password-verify";

export function useForgotPasswordVerify() {
  return useMutation({
    mutationFn: (data: ForgotPasswordVerifyData) => forgotPasswordVerify(data),
  });
}
