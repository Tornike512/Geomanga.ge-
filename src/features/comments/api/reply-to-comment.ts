import { api } from "@/lib/api-client";
import type { CommentDetail } from "@/types/comment.types";

export const replyToComment = async (
  commentId: number,
  content: string,
): Promise<CommentDetail> => {
  return api.post<CommentDetail>(
    `/comments/${commentId}/reply`,
    { content },
    { requiresAuth: true },
  );
};
