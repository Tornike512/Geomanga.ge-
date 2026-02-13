import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types/api.types";
import { getMangadexReadingHistory } from "../api/get-mangadex-reading-history";

export const useMangadexReadingHistory = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["mangadex-history", params],
    queryFn: () => getMangadexReadingHistory(params),
    staleTime: 5 * 60 * 1000,
  });
};
