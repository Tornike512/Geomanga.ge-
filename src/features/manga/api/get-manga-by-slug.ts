import { api } from "@/lib/api-client";
import type { MangaDetail } from "@/types/manga.types";

export const getMangaBySlug = async (slug: string): Promise<MangaDetail> => {
  return api.get<MangaDetail>(`/manga/slug/${slug}`);
};
