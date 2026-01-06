import { api } from "@/lib/api-client";
import type { Manga, MangaUpdate } from "@/types/manga.types";

export const updateManga = async (
  mangaId: number,
  data: MangaUpdate,
): Promise<Manga> => {
  return api.put<Manga>(`/manga/${mangaId}`, data, { requiresAuth: true });
};
