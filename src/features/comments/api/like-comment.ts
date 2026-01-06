import { api } from "@/lib/api-client";

export const likeComment = async (commentId: number): Promise<void> => {
  await api.post(`/comments/${commentId}/like`, undefined, {
    requiresAuth: true,
  });
};
