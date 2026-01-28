import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChapterComment } from "../api/create-chapter-comment";

export const useCreateChapterComment = (chapterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createChapterComment(chapterId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "chapter", chapterId],
      });
    },
  });
};
