import { api } from "@/lib/api-client";
import type { LibraryCategory } from "@/types/library.types";

export const removeLibraryEntry = async (
  mangaId: number,
  category: LibraryCategory,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(
    `/library/manga/${mangaId}?category=${category}`,
    { requiresAuth: true },
  );
};
