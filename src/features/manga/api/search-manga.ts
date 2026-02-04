import { api } from "@/lib/api-client";
import type {
  Manga,
  MangaListResponse,
  MangaSearchParams,
} from "@/types/manga.types";

export const searchManga = async (
  params: MangaSearchParams,
): Promise<Manga[]> => {
  const searchParams = {
    ...params,
    language: params.language ?? "georgian",
    limit: params.limit ?? 5,
  };
  const response = await api.get<MangaListResponse>("/manga/search", {
    params: searchParams,
  });
  return response.items;
};
