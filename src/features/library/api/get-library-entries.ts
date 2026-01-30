import { api } from "@/lib/api-client";
import type { PaginationParams } from "@/types/api.types";
import type {
  LibraryCategory,
  LibraryListResponse,
} from "@/types/library.types";

export interface GetLibraryEntriesParams extends PaginationParams {
  category: LibraryCategory;
}

export const getLibraryEntries = async (
  params: GetLibraryEntriesParams,
): Promise<LibraryListResponse> => {
  return api.get<LibraryListResponse>("/library", {
    params: {
      category: params.category,
      page: params.page,
      limit: params.limit,
    },
    requiresAuth: true,
  });
};
