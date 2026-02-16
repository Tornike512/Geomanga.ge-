import { api } from "@/lib/api-client";
import type { MangadexMangaCategoryResponse } from "@/types/library.types";

export const getMangadexMangaCategory = async (
  mangadexMangaId: string,
): Promise<MangadexMangaCategoryResponse> => {
  return api.get<MangadexMangaCategoryResponse>(
    `/mangadex-library/manga/${mangadexMangaId}/category`,
    { requiresAuth: true },
  );
};
