import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type RegisterVerifyData,
  registerVerify,
} from "../api/register-verify";

export function useRegisterVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterVerifyData) => registerVerify(data),
    onSuccess: () => {
      // Invalidate user query to fetch the newly created user
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
