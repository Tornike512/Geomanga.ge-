import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadBanner } from "../api/upload-banner";

export const useUploadBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadBanner(file),
    onSuccess: async () => {
      // Invalidate and refetch the current user query
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      // Force refetch to ensure UI updates
      await queryClient.refetchQueries({ queryKey: ["user", "me"] });
    },
  });
};
