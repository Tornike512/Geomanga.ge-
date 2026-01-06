import { api } from "@/lib/api-client";

export const removeBookmark = async (
  mangaId: number,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(`/bookmarks/manga/${mangaId}`, {
    requiresAuth: true,
  });
};
