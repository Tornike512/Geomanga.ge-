import { api } from "@/lib/api-client";
import type { PaginationParams } from "@/types/api.types";
import type {
  LibraryCategory,
  MangadexLibraryListResponse,
} from "@/types/library.types";

export interface GetMangadexLibraryEntriesParams extends PaginationParams {
  category: LibraryCategory;
}

export const getMangadexLibraryEntries = async (
  params: GetMangadexLibraryEntriesParams,
): Promise<MangadexLibraryListResponse> => {
  return api.get<MangadexLibraryListResponse>("/mangadex-library", {
    params: {
      category: params.category,
      page: params.page,
      limit: params.limit,
    },
    requiresAuth: true,
  });
};
