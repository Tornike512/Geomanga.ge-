import { api } from "@/lib/api-client";
import type { ChapterDetail } from "@/types/chapter.types";

export const getChaptersByManga = async (
  mangaId: number,
): Promise<ChapterDetail[]> => {
  return api.get<ChapterDetail[]>(`/manga/${mangaId}/chapters`);
};
