import { api } from "@/lib/api-client";
import type { Chapter, ChapterListResponse } from "@/types/chapter.types";

export const getChaptersByManga = async (
  mangaId: number,
): Promise<Chapter[]> => {
  const response = await api.get<ChapterListResponse>(
    `/manga/${mangaId}/chapters`,
  );
  return response.items;
};
