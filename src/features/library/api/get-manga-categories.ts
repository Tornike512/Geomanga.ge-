import { api } from "@/lib/api-client";
import type { MangaCategoriesResponse } from "@/types/library.types";

export const getMangaCategories = async (
  mangaId: number,
): Promise<MangaCategoriesResponse> => {
  return api.get<MangaCategoriesResponse>(
    `/library/manga/${mangaId}/categories`,
    {
      requiresAuth: true,
    },
  );
};
