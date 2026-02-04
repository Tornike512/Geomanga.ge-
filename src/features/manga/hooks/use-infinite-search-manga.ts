import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { MangaListResponse, MangaSearchParams } from "@/types/manga.types";

export const useInfiniteSearchManga = (
  params: Omit<MangaSearchParams, "page">,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: ["manga", "search", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const searchParams = {
        ...params,
        language: params.language ?? "georgian",
        limit: params.limit ?? 6,
        page: pageParam,
      };
      const response = await api.get<MangaListResponse>("/manga/search", {
        params: searchParams,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      // If current page < total pages, return next page number
      return lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};
