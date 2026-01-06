import { api } from "@/lib/api-client";
import type { Manga } from "@/types/manga.types";

export const getRecentManga = async (): Promise<Manga[]> => {
  return api.get<Manga[]>("/manga/recent");
};
