import { useQuery } from "@tanstack/react-query";
import { getRecentManga } from "../api/get-recent-manga";

export const useRecentManga = () => {
  return useQuery({
    queryKey: ["manga", "recent"],
    queryFn: getRecentManga,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
