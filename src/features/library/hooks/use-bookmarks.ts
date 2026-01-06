import { useQuery } from "@tanstack/react-query";
import type { PaginationParams } from "@/types/api.types";
import { getBookmarks } from "../api/get-bookmarks";

export const useBookmarks = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: ["bookmarks", params],
    queryFn: () => getBookmarks(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};
