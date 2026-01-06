import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "../api/upload-avatar";

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
