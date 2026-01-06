import { api } from "@/lib/api-client";

export const deleteManga = async (
  mangaId: number,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(`/manga/${mangaId}`, {
    requiresAuth: true,
  });
};
