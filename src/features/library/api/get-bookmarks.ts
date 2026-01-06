import { api } from "@/lib/api-client";
import type { PaginationParams } from "@/types/api.types";
import type { BookmarkListResponse } from "@/types/bookmark.types";

export const getBookmarks = async (
  params: PaginationParams = {},
): Promise<BookmarkListResponse> => {
  return api.get<BookmarkListResponse>("/bookmarks", {
    params: params as Record<
      string,
      string | number | boolean | undefined | null
    >,
    requiresAuth: true,
  });
};
