import { api } from "@/lib/api-client";

export const deleteComment = async (
  commentId: number,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(`/comments/${commentId}`, {
    requiresAuth: true,
  });
};
