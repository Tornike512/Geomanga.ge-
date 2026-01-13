import { api } from "@/lib/api-client";
import type { Manga } from "@/types/manga.types";

export const searchManga = async (query: string): Promise<Manga[]> => {
  return api.get<Manga[]>("/manga/search", { params: { q: query } });
};
