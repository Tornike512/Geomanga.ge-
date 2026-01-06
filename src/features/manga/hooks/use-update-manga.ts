import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MangaUpdate } from "@/types/manga.types";
import { updateManga } from "../api/update-manga";

export const useUpdateManga = (mangaId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MangaUpdate) => updateManga(mangaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga", "detail", mangaId] });
      queryClient.invalidateQueries({ queryKey: ["manga", "list"] });
    },
  });
};
