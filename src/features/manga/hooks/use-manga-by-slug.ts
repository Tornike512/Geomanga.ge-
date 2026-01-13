import { useQuery } from "@tanstack/react-query";
import { getMangaBySlug } from "../api/get-manga-by-slug";

export const useMangaBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["manga", "slug", slug],
    queryFn: () => getMangaBySlug(slug),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
