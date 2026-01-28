import { api } from "@/lib/api-client";
import type {
  CommentListResponse,
  CommentPaginationParams,
} from "@/types/comment.types";

export const getMangaComments = async (
  mangaId: number,
  params?: CommentPaginationParams,
): Promise<CommentListResponse> => {
  return api.get<CommentListResponse>(`/manga/${mangaId}/comments`, {
    params: {
      page: params?.page,
      page_size: params?.page_size,
    },
  });
};
