import { api } from "@/lib/api-client";
import type { CommentLikeResponse } from "@/types/comment.types";

export const toggleLikeComment = async (
  commentId: number,
): Promise<CommentLikeResponse> => {
  return api.post<CommentLikeResponse>(
    `/comments/${commentId}/like`,
    undefined,
    {
      requiresAuth: true,
    },
  );
};

/**
 * @deprecated Use toggleLikeComment instead. The API now uses a toggle approach.
 */
export const likeComment = toggleLikeComment;
