import { api } from "@/lib/api-client";
import type { ReadingHistoryCreate } from "@/types/history.types";

export const trackReading = async (
  data: ReadingHistoryCreate,
): Promise<void> => {
  await api.post("/history", data, { requiresAuth: true });
};
