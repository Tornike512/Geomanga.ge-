import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types/api.types";
import { getReadingHistory } from "../api/get-reading-history";

export const useReadingHistory = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["history", params],
    queryFn: () => getReadingHistory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
