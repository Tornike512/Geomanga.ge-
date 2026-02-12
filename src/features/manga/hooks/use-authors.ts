import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "../api/get-authors";

export const useAuthors = (query: string) => {
  return useQuery({
    queryKey: ["authors", query],
    queryFn: () => getAuthors(query),
    staleTime: 60 * 1000,
  });
};
