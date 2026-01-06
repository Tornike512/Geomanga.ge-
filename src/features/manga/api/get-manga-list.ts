import { api } from "@/lib/api-client";
import type { MangaListParams, MangaListResponse } from "@/types/manga.types";

export const getMangaList = async (
  params: MangaListParams = {},
): Promise<MangaListResponse> => {
  return api.get<MangaListResponse>("/manga", { params });
};
