import { useQuery } from "@tanstack/react-query";
import { getChapterWithPages } from "../api/get-chapter-with-pages";

export const useChapterWithPages = (chapterId: number) => {
  return useQuery({
    queryKey: ["chapters", "detail", chapterId],
    queryFn: () => getChapterWithPages(chapterId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: chapterId > 0,
  });
};
