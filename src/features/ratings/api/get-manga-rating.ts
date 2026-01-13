import { api } from "@/lib/api-client";
import type { MangaRatingStats } from "@/types/rating.types";

export const getMangaRating = async (
  mangaId: number,
): Promise<MangaRatingStats> => {
  return api.get<MangaRatingStats>(`/ratings/manga/${mangaId}`);
};
