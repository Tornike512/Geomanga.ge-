import type { Manga } from "./manga.types";

export interface Bookmark {
  readonly id: number;
  readonly user_id: number;
  readonly manga_id: number;
  readonly created_at: string;
}

export interface BookmarkWithManga extends Bookmark {
  readonly manga: Manga;
}

export interface BookmarkListResponse {
  readonly items: BookmarkWithManga[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly pages: number;
}

export interface BookmarkCreate {
  readonly manga_id: number;
}
