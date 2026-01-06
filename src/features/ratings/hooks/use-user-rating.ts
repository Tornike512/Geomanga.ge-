import { useQuery } from "@tanstack/react-query";
import { getUserRating } from "../api/get-user-rating";

export const useUserRating = (mangaId: number) => {
  return useQuery({
    queryKey: ["ratings", "user", mangaId],
    queryFn: () => getUserRating(mangaId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
