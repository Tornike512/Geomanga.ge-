import { api } from "@/lib/api-client";
import type { Rating } from "@/types/rating.types";

export const getUserRating = async (
  mangaId: number,
): Promise<Rating | undefined> => {
  return api.get<Rating | undefined>(`/ratings/manga/${mangaId}/my-rating`, {
    requiresAuth: true,
  });
};
