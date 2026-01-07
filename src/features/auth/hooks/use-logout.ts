import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../api/logout";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Invalidate and remove user query immediately
      queryClient.setQueryData(["user", "me"], null);
      queryClient.removeQueries({ queryKey: ["user", "me"] });
      queryClient.clear();
      router.push("/login");
    },
  });
};
