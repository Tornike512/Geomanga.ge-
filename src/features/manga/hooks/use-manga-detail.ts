import { useQuery } from "@tanstack/react-query";
import { getMangaDetail } from "../api/get-manga-detail";

export const useMangaDetail = (mangaId: number) => {
  return useQuery({
    queryKey: ["manga", "detail", mangaId],
    queryFn: () => getMangaDetail(mangaId),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
