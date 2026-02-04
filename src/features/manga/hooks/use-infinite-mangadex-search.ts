import { useInfiniteQuery } from "@tanstack/react-query";
import { searchMangaDex } from "../api/get-mangadex-manga";

export const useInfiniteMangaDexSearch = (title: string, enabled = true) => {
  const limit = 6;

  return useInfiniteQuery({
    queryKey: ["mangadex", "search", "infinite", title],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * limit;
      const results = await searchMangaDex(title, limit, offset);
      return {
        items: results,
        nextPage: results.length === limit ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
