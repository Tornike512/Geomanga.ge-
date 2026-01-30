import { useQuery } from "@tanstack/react-query";
import type { LibraryCategory } from "@/types/library.types";
import {
  type GetLibraryEntriesParams,
  getLibraryEntries,
} from "../api/get-library-entries";

export const useLibraryEntries = (
  category: LibraryCategory,
  params: Omit<GetLibraryEntriesParams, "category"> = {},
) => {
  return useQuery({
    queryKey: ["library", category, params],
    queryFn: () => getLibraryEntries({ ...params, category }),
    staleTime: 30 * 1000,
  });
};
