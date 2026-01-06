import { useQuery } from "@tanstack/react-query";
import { getTrendingManga } from "../api/get-trending-manga";

export const useTrendingManga = () => {
  return useQuery({
    queryKey: ["manga", "trending"],
    queryFn: getTrendingManga,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
