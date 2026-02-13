import { api } from "@/lib/api-client";
import type { MangadexReadingHistoryCreate } from "@/types/history.types";

export const trackMangadexReading = async (
  data: MangadexReadingHistoryCreate,
): Promise<void> => {
  await api.post("/mangadex-history", data, { requiresAuth: true });
};
