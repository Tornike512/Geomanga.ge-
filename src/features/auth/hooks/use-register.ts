import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UserCreate } from "@/types/user.types";
import { register } from "../api/register";

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserCreate) => register(userData),
    onSuccess: () => {
      // Invalidate and refetch the user immediately
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.refetchQueries({ queryKey: ["user", "me"] });
      router.push("/");
    },
  });
};
