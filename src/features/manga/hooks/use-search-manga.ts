import { useQuery } from "@tanstack/react-query";
import type { MangaSearchParams } from "@/types/manga.types";
import { searchManga } from "../api/search-manga";

export const useSearchManga = (params: MangaSearchParams, enabled = true) => {
  return useQuery({
    queryKey: ["manga", "search", params],
    queryFn: () => searchManga(params),
    enabled: enabled && params.q.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};
