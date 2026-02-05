import { useMutation } from "@tanstack/react-query";
import {
  type ForgotPasswordRequestData,
  forgotPasswordRequest,
} from "../api/forgot-password-request";

export function useForgotPasswordRequest() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequestData) =>
      forgotPasswordRequest(data),
  });
}
