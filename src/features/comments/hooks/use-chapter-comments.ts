import { useQuery } from "@tanstack/react-query";
import type { CommentPaginationParams } from "@/types/comment.types";
import { getChapterComments } from "../api/get-chapter-comments";

export const useChapterComments = (
  chapterId: number,
  params?: CommentPaginationParams,
) => {
  return useQuery({
    queryKey: ["comments", "chapter", chapterId, params],
    queryFn: () => getChapterComments(chapterId, params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
