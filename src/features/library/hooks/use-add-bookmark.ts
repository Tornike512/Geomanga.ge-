import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BookmarkCreate } from "@/types/bookmark.types";
import { addBookmark } from "../api/add-bookmark";

export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookmarkCreate) => addBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
};
