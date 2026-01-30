import type { Manga } from "./manga.types";

export const LIBRARY_CATEGORIES = {
  bookmarks: "სანიშნეები",
  dropped: "მიტოვებული",
  toread: "წასაკითხი",
  favorites: "ფავორიტები",
} as const;

export type LibraryCategory = keyof typeof LIBRARY_CATEGORIES;

export interface LibraryEntry {
  readonly id: number;
  readonly user_id: number;
  readonly manga_id: number;
  readonly category: LibraryCategory;
  readonly created_at: string;
}

export interface LibraryEntryWithManga extends LibraryEntry {
  readonly manga: Manga;
}

export interface LibraryListResponse {
  readonly items: LibraryEntryWithManga[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly pages: number;
}

export interface LibraryEntryCreate {
  readonly manga_id: number;
  readonly category: LibraryCategory;
}

export interface MangaCategoriesResponse {
  readonly categories: LibraryCategory[];
}
