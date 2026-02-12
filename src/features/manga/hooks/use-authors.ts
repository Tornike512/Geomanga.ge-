import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "../api/get-authors";

export const useAuthors = (query: string) => {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["authors", trimmed],
    queryFn: () => getAuthors(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 60 * 1000,
  });
};
