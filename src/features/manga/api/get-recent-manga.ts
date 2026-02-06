import { api } from "@/lib/api-client";
import type { Manga, MangaListResponse } from "@/types/manga.types";

export const getRecentManga = async (): Promise<Manga[]> => {
  const response = await api.get<MangaListResponse>("/manga/recent");
  return response.items;
};
