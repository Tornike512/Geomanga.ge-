import { api } from "@/lib/api-client";
import type { Comment } from "@/types/comment.types";

export const createMangadexChapterComment = async (
  mangadexChapterId: string,
  content: string,
): Promise<Comment> => {
  return api.post<Comment>(
    `/mangadex-chapters/${mangadexChapterId}/comments`,
    { content },
    { requiresAuth: true },
  );
};
