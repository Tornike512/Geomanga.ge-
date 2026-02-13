import { api } from "@/lib/api-client";
import type { PaginationParams } from "@/types/api.types";
import type { MangadexReadingHistoryListResponse } from "@/types/history.types";

export const getMangadexReadingHistory = async (
  params: PaginationParams = {},
): Promise<MangadexReadingHistoryListResponse> => {
  return api.get<MangadexReadingHistoryListResponse>("/mangadex-history", {
    params: params as Record<
      string,
      string | number | boolean | undefined | null
    >,
    requiresAuth: true,
  });
};
