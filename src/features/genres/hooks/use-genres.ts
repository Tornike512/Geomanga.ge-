import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../api/get-genres";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
