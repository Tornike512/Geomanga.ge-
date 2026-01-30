import { api } from "@/lib/api-client";
import type { MangaCategoryResponse } from "@/types/library.types";

export const getMangaCategory = async (
  mangaId: number,
): Promise<MangaCategoryResponse> => {
  return api.get<MangaCategoryResponse>(`/library/manga/${mangaId}/category`, {
    requiresAuth: true,
  });
};
