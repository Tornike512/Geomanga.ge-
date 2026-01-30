import { useQuery } from "@tanstack/react-query";
import { getMangaCategories } from "../api/get-manga-categories";

export const useMangaCategories = (mangaId: number | undefined) => {
  return useQuery({
    queryKey: ["manga-categories", mangaId],
    queryFn: () => getMangaCategories(mangaId as number),
    enabled: !!mangaId,
    staleTime: 30 * 1000,
  });
};
