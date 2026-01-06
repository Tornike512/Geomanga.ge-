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
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      router.push("/");
    },
  });
};
