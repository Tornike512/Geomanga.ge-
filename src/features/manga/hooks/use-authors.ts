import { useQuery } from "@tanstack/react-query";
import { transliterate } from "transliteration";
import { getAuthors } from "../api/get-authors";

export const useAuthors = (query: string) => {
  const transliterated = transliterate(query).trim();

  return useQuery({
    queryKey: ["authors", transliterated],
    queryFn: () => getAuthors(transliterated),
    enabled: transliterated.length > 0,
    staleTime: 60 * 1000,
  });
};
