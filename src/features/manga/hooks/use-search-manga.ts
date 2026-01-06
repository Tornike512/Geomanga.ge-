import { useQuery } from "@tanstack/react-query";
import { searchManga } from "../api/search-manga";

export const useSearchManga = (query: string, enabled = true) => {
  return useQuery({
    queryKey: ["manga", "search", query],
    queryFn: () => searchManga(query),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};
