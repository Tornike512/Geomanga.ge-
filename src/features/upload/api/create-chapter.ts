import { api } from "@/lib/api-client";
import type { Chapter, ChapterCreate } from "@/types/chapter.types";

export const createChapter = async (
  mangaId: number,
  data: ChapterCreate,
): Promise<Chapter> => {
  return api.post<Chapter>(`/manga/${mangaId}/chapters`, data, {
    requiresAuth: true,
  });
};
