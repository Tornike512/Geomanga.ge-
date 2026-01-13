import { useQuery } from "@tanstack/react-query";
import { getMangaProgress } from "../api/get-manga-progress";

export const useMangaProgress = (mangaId: number) => {
  return useQuery({
    queryKey: ["history", "manga", mangaId],
    queryFn: () => getMangaProgress(mangaId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
