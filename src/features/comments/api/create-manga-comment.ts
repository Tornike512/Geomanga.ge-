import { api } from "@/lib/api-client";
import type { Comment } from "@/types/comment.types";

export const createMangaComment = async (
  mangaId: number,
  content: string,
): Promise<Comment> => {
  return api.post<Comment>(
    `/manga/${mangaId}/comments`,
    { content },
    { requiresAuth: true },
  );
};
