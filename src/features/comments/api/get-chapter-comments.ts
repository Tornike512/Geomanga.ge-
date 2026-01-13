import { api } from "@/lib/api-client";
import type { CommentListResponse } from "@/types/comment.types";

export const getChapterComments = async (
  chapterId: number,
): Promise<CommentListResponse> => {
  return api.get<CommentListResponse>(`/chapters/${chapterId}/comments`);
};
