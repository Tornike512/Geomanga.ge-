import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMangaComment } from "../api/create-manga-comment";

export const useCreateMangaComment = (mangaId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createMangaComment(mangaId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "manga", mangaId],
      });
    },
  });
};
