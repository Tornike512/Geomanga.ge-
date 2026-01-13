import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBookmark } from "../api/remove-bookmark";

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mangaId: number) => removeBookmark(mangaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
};
