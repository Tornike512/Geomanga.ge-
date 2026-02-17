import { api } from "@/lib/api-client";
import type { Comment } from "@/types/comment.types";

export const mangadexUpdateComment = async (
  commentId: number,
  content: string,
): Promise<Comment> => {
  return api.put<Comment>(
    `/mangadex-chapters/comments/${commentId}`,
    { content },
    { requiresAuth: true },
  );
};
