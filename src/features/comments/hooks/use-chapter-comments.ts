import { useQuery } from "@tanstack/react-query";
import { getChapterComments } from "../api/get-chapter-comments";

export const useChapterComments = (chapterId: number) => {
  return useQuery({
    queryKey: ["comments", "chapter", chapterId],
    queryFn: () => getChapterComments(chapterId),
    staleTime: 30 * 1000, // 30 seconds
  });
};
