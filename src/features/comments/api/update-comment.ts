import { api } from "@/lib/api-client";
import type { Comment } from "@/types/comment.types";

export const updateComment = async (
  commentId: number,
  content: string,
): Promise<Comment> => {
  return api.put<Comment>(
    `/comments/${commentId}`,
    { content },
    { requiresAuth: true },
  );
};
