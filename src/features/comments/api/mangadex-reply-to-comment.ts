import { api } from "@/lib/api-client";
import type { CommentDetail } from "@/types/comment.types";

export const mangadexReplyToComment = async (
  commentId: number,
  content: string,
): Promise<CommentDetail> => {
  return api.post<CommentDetail>(
    `/mangadex-chapters/comments/${commentId}/reply`,
    { content },
    { requiresAuth: true },
  );
};
