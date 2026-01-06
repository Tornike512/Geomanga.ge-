import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChapterCreate } from "@/types/chapter.types";
import { createChapter } from "../api/create-chapter";

export const useCreateChapter = (mangaId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChapterCreate) => createChapter(mangaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", "manga", mangaId],
      });
      queryClient.invalidateQueries({ queryKey: ["manga", "detail", mangaId] });
    },
  });
};
