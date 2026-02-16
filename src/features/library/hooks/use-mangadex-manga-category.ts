import { useQuery } from "@tanstack/react-query";
import { getMangadexMangaCategory } from "../api/get-mangadex-manga-category";

export const useMangadexMangaCategory = (
  mangadexMangaId: string | undefined,
) => {
  return useQuery({
    queryKey: ["mangadex-manga-category", mangadexMangaId],
    queryFn: () => getMangadexMangaCategory(mangadexMangaId as string),
    enabled: !!mangadexMangaId,
    staleTime: 30 * 1000,
  });
};
