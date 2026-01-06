import { useQuery } from "@tanstack/react-query";
import type { MangaListParams } from "@/types/manga.types";
import { getMangaList } from "../api/get-manga-list";

export const useMangaList = (params: MangaListParams = {}) => {
  return useQuery({
    queryKey: ["manga", "list", params],
    queryFn: () => getMangaList(params),
    staleTime: 60 * 1000, // 1 minute
  });
};
