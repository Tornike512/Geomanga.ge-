import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserUpdate } from "@/types/user.types";
import { updateProfile } from "../api/update-profile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserUpdate) => updateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
