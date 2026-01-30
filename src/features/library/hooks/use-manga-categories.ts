import { useQuery } from "@tanstack/react-query";
import { getMangaCategory } from "../api/get-manga-categories";

export const useMangaCategory = (mangaId: number | undefined) => {
  return useQuery({
    queryKey: ["manga-categories", mangaId],
    queryFn: () => getMangaCategory(mangaId as number),
    enabled: !!mangaId,
    staleTime: 30 * 1000,
  });
};
