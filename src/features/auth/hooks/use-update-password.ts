import { useMutation } from "@tanstack/react-query";
import type { PasswordUpdate } from "@/types/user.types";
import { updatePassword } from "../api/update-password";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: PasswordUpdate) => updatePassword(data),
  });
};
