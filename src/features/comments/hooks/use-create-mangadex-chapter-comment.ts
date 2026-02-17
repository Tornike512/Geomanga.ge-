import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMangadexChapterComment } from "../api/create-mangadex-chapter-comment";

export const useCreateMangadexChapterComment = (
  mangadexChapterId: string,
  mangadexMangaId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      createMangadexChapterComment(mangadexChapterId, content, mangadexMangaId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", "mangadex-chapter", mangadexChapterId],
        refetchType: "all",
      });
    },
  });
};
