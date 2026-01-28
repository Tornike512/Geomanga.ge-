import { api } from "@/lib/api-client";
import type {
  CommentListResponse,
  CommentPaginationParams,
} from "@/types/comment.types";

export const getChapterComments = async (
  chapterId: number,
  params?: CommentPaginationParams,
): Promise<CommentListResponse> => {
  return api.get<CommentListResponse>(`/chapters/${chapterId}/comments`, {
    params: {
      page: params?.page,
      page_size: params?.page_size,
    },
  });
};
