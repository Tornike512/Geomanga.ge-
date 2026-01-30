import { api } from "@/lib/api-client";
import type { LibraryEntry, LibraryEntryCreate } from "@/types/library.types";

export const addLibraryEntry = async (
  data: LibraryEntryCreate,
): Promise<LibraryEntry> => {
  return api.post<LibraryEntry>("/library", data, { requiresAuth: true });
};
