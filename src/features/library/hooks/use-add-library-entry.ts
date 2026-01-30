import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LibraryEntryCreate } from "@/types/library.types";
import { addLibraryEntry } from "../api/add-library-entry";

export const useAddLibraryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LibraryEntryCreate) => addLibraryEntry(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["library", variables.category],
      });
      queryClient.invalidateQueries({
        queryKey: ["manga-categories", variables.manga_id],
      });
      // Also invalidate bookmarks for backwards compatibility
      if (variables.category === "bookmarks") {
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      }
    },
  });
};
