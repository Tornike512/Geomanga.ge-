import { api } from "@/lib/api-client";
import type { CommentListResponse } from "@/types/comment.types";

export const getMangaComments = async (
  mangaId: number,
): Promise<CommentListResponse> => {
  return api.get<CommentListResponse>(`/manga/${mangaId}/comments`);
};
