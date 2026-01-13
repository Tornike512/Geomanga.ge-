import { api } from "@/lib/api-client";

export const deleteRating = async (
  mangaId: number,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(`/ratings/manga/${mangaId}`, {
    requiresAuth: true,
  });
};
