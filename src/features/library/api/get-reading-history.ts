import { api } from "@/lib/api-client";
import type { PaginationParams } from "@/types/api.types";
import type { ReadingHistoryListResponse } from "@/types/history.types";

export const getReadingHistory = async (
  params: PaginationParams = {},
): Promise<ReadingHistoryListResponse> => {
  return api.get<ReadingHistoryListResponse>("/history", {
    params: params as Record<
      string,
      string | number | boolean | undefined | null
    >,
    requiresAuth: true,
  });
};
