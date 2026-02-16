import { useQuery } from "@tanstack/react-query";
import type { LibraryCategory } from "@/types/library.types";
import {
  type GetMangadexLibraryEntriesParams,
  getMangadexLibraryEntries,
} from "../api/get-mangadex-library-entries";

export const useMangadexLibraryEntries = (
  category: LibraryCategory,
  params: Omit<GetMangadexLibraryEntriesParams, "category"> = {},
) => {
  return useQuery({
    queryKey: ["mangadex-library", category, params],
    queryFn: () => getMangadexLibraryEntries({ ...params, category }),
    staleTime: 30 * 1000,
  });
};
