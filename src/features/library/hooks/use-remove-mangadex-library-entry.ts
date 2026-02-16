import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LibraryCategory } from "@/types/library.types";
import { removeMangadexLibraryEntry } from "../api/remove-mangadex-library-entry";

export const useRemoveMangadexLibraryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mangadexMangaId,
      category,
    }: {
      mangadexMangaId: string;
      category: LibraryCategory;
    }) => removeMangadexLibraryEntry(mangadexMangaId, category),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mangadex-library", variables.category],
      });
      queryClient.invalidateQueries({
        queryKey: ["mangadex-manga-category", variables.mangadexMangaId],
      });
    },
  });
};
