import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UserCreate } from "@/types/user.types";
import { login } from "../api/login";
import { register } from "../api/register";

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UserCreate) => {
      // Register the user
      const user = await register(userData);

      // Automatically login with the same credentials
      await login({
        login: userData.email,
        password: userData.password,
      });

      return user;
    },
    onSuccess: async () => {
      // Invalidate user query to fetch fresh data
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });

      // Redirect to home
      router.push("/");
    },
  });
};
