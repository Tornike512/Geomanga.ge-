import { api } from "@/lib/api-client";
import type { CommentLikeResponse } from "@/types/comment.types";

export const mangadexToggleLikeComment = async (
  commentId: number,
): Promise<CommentLikeResponse> => {
  return api.post<CommentLikeResponse>(
    `/mangadex-chapters/comments/${commentId}/like`,
    undefined,
    {
      requiresAuth: true,
    },
  );
};
