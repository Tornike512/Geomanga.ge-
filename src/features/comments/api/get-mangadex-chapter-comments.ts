import { api } from "@/lib/api-client";
import type {
  CommentListResponse,
  CommentPaginationParams,
} from "@/types/comment.types";

export const getMangadexChapterComments = async (
  mangadexChapterId: string,
  params?: CommentPaginationParams,
): Promise<CommentListResponse> => {
  return api.get<CommentListResponse>(
    `/mangadex-chapters/${mangadexChapterId}/comments`,
    {
      params: {
        page: params?.page,
        page_size: params?.page_size,
      },
    },
  );
};
