import { api } from "@/lib/api-client";

export const unlikeComment = async (commentId: number): Promise<void> => {
  await api.delete(`/comments/${commentId}/like`, { requiresAuth: true });
};
