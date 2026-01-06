import { api } from "@/lib/api-client";
import type { Bookmark, BookmarkCreate } from "@/types/bookmark.types";

export const addBookmark = async (data: BookmarkCreate): Promise<Bookmark> => {
  return api.post<Bookmark>("/bookmarks", data, { requiresAuth: true });
};
