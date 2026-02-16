import { api } from "@/lib/api-client";
import type {
  MangadexLibraryEntry,
  MangadexLibraryEntryCreate,
} from "@/types/library.types";

export const addMangadexLibraryEntry = async (
  data: MangadexLibraryEntryCreate,
): Promise<MangadexLibraryEntry> => {
  return api.post<MangadexLibraryEntry>("/mangadex-library", data, {
    requiresAuth: true,
  });
};
