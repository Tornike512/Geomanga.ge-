import { useQuery } from "@tanstack/react-query";
import { getMangaRating } from "../api/get-manga-rating";

export const useMangaRating = (mangaId: number) => {
  return useQuery({
    queryKey: ["ratings", "manga", mangaId],
    queryFn: () => getMangaRating(mangaId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
