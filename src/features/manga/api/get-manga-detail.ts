import { api } from "@/lib/api-client";
import type { MangaDetail } from "@/types/manga.types";

export const getMangaDetail = async (mangaId: number): Promise<MangaDetail> => {
  return api.get<MangaDetail>(`/manga/${mangaId}`);
};
