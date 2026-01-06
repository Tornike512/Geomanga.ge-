import { useQuery } from "@tanstack/react-query";
import { getMangaComments } from "../api/get-manga-comments";

export const useMangaComments = (mangaId: number) => {
  return useQuery({
    queryKey: ["comments", "manga", mangaId],
    queryFn: () => getMangaComments(mangaId),
    staleTime: 30 * 1000, // 30 seconds
  });
};
