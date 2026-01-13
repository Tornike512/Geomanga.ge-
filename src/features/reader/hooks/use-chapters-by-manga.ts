import { useQuery } from "@tanstack/react-query";
import { getChaptersByManga } from "../api/get-chapters-by-manga";

export const useChaptersByManga = (mangaId: number) => {
  return useQuery({
    queryKey: ["chapters", "manga", mangaId],
    queryFn: () => getChaptersByManga(mangaId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
