import { useMutation } from "@tanstack/react-query";
import {
  type RegisterRequestData,
  registerRequest,
} from "../api/register-request";

export function useRegisterRequest() {
  return useMutation({
    mutationFn: (data: RegisterRequestData) => registerRequest(data),
  });
}
