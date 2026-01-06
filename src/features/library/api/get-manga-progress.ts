import { api } from "@/lib/api-client";
import type { ReadingHistory } from "@/types/history.types";

export const getMangaProgress = async (
  mangaId: number,
): Promise<ReadingHistory | undefined> => {
  return api.get<ReadingHistory | undefined>(`/history/manga/${mangaId}`, {
    requiresAuth: true,
  });
};
