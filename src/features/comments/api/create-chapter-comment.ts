import { api } from "@/lib/api-client";
import type { Comment } from "@/types/comment.types";

export const createChapterComment = async (
  chapterId: number,
  content: string,
): Promise<Comment> => {
  return api.post<Comment>(
    `/chapters/${chapterId}/comments`,
    { content },
    { requiresAuth: true },
  );
};
