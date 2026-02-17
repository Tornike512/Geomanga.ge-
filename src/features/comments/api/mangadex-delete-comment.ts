import { api } from "@/lib/api-client";

export const mangadexDeleteComment = async (
  commentId: number,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(
    `/mangadex-chapters/comments/${commentId}`,
    {
      requiresAuth: true,
    },
  );
};
