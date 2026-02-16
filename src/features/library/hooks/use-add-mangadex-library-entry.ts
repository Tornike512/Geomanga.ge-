import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MangadexLibraryEntryCreate } from "@/types/library.types";
import { addMangadexLibraryEntry } from "../api/add-mangadex-library-entry";

export const useAddMangadexLibraryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MangadexLibraryEntryCreate) =>
      addMangadexLibraryEntry(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mangadex-library", variables.category],
      });
      queryClient.invalidateQueries({
        queryKey: ["mangadex-manga-category", variables.mangadex_manga_id],
      });
    },
  });
};
