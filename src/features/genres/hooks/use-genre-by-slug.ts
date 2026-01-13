import { useQuery } from "@tanstack/react-query";
import { getGenreBySlug } from "../api/get-genre-by-slug";

export const useGenreBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["genres", "slug", slug],
    queryFn: () => getGenreBySlug(slug),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
