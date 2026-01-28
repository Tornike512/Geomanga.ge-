import { useQuery } from "@tanstack/react-query";
import type { CommentPaginationParams } from "@/types/comment.types";
import { getMangaComments } from "../api/get-manga-comments";

export const useMangaComments = (
  mangaId: number,
  params?: CommentPaginationParams,
) => {
  return useQuery({
    queryKey: ["comments", "manga", mangaId, params],
    queryFn: () => getMangaComments(mangaId, params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
