import { api } from "@/lib/api-client";
import type { ChapterWithPages } from "@/types/chapter.types";

export const getChapterWithPages = async (
  chapterId: number,
): Promise<ChapterWithPages> => {
  return api.get<ChapterWithPages>(`/chapters/${chapterId}`);
};
