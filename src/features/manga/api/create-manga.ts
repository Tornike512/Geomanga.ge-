import { api } from "@/lib/api-client";
import type { Manga, MangaCreate } from "@/types/manga.types";

export const createManga = async (data: MangaCreate): Promise<Manga> => {
  return api.post<Manga>("/manga", data, { requiresAuth: true });
};
