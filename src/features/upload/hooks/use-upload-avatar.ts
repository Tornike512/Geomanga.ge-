import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "../api/upload-avatar";

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: async () => {
      // Invalidate and refetch the current user query
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      // Force refetch to ensure UI updates
      await queryClient.refetchQueries({ queryKey: ["user", "me"] });
    },
  });
};
