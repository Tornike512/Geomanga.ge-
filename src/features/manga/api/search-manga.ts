import { api } from "@/lib/api-client";
import type { Manga, MangaSearchParams } from "@/types/manga.types";

export const searchManga = async (
  params: MangaSearchParams,
): Promise<Manga[]> => {
  const searchParams = {
    ...params,
    language: params.language ?? "georgian",
    limit: params.limit ?? 5,
  };
  return api.get<Manga[]>("/manga/search", { params: searchParams });
};
