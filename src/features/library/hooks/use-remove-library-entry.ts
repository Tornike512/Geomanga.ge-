import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LibraryCategory } from "@/types/library.types";
import { removeLibraryEntry } from "../api/remove-library-entry";

export const useRemoveLibraryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mangaId,
      category,
    }: {
      mangaId: number;
      category: LibraryCategory;
    }) => removeLibraryEntry(mangaId, category),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["library", variables.category],
      });
      queryClient.invalidateQueries({
        queryKey: ["manga-categories", variables.mangaId],
      });
      // Also invalidate bookmarks for backwards compatibility
      if (variables.category === "bookmarks") {
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      }
    },
  });
};
