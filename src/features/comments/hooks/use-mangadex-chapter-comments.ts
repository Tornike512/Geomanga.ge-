import { useQuery } from "@tanstack/react-query";
import type { CommentPaginationParams } from "@/types/comment.types";
import { getMangadexChapterComments } from "../api/get-mangadex-chapter-comments";

export const useMangadexChapterComments = (
  mangadexChapterId: string,
  params?: CommentPaginationParams,
) => {
  return useQuery({
    queryKey: ["comments", "mangadex-chapter", mangadexChapterId, params],
    queryFn: () => getMangadexChapterComments(mangadexChapterId, params),
    enabled: !!mangadexChapterId,
    staleTime: 30 * 1000,
  });
};
