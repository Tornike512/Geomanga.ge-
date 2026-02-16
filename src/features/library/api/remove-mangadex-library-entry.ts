import { api } from "@/lib/api-client";
import type { LibraryCategory } from "@/types/library.types";

export const removeMangadexLibraryEntry = async (
  mangadexMangaId: string,
  category: LibraryCategory,
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(
    `/mangadex-library/manga/${mangadexMangaId}?category=${category}`,
    { requiresAuth: true },
  );
};
