import type { Chapter } from "./chapter.types";
import type { Manga } from "./manga.types";

export interface ReadingHistory {
  readonly id: number;
  readonly user_id: number;
  readonly manga_id: number;
  readonly chapter_id: number;
  readonly last_read_at: string;
}

export interface ReadingHistoryWithDetails extends ReadingHistory {
  readonly manga: Manga;
  readonly chapter: Chapter;
}

export interface ReadingHistoryListResponse {
  readonly items: ReadingHistoryWithDetails[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly pages: number;
}

export interface ReadingHistoryCreate {
  readonly manga_id: number;
  readonly chapter_id: number;
}

export interface ReadingHistoryUpdate {
  readonly chapter_id: number;
}

export interface MangadexReadingHistory {
  readonly id: number;
  readonly user_id: number;
  readonly mangadex_manga_id: string;
  readonly mangadex_chapter_id: string;
  readonly manga_title: string;
  readonly chapter_number: string;
  readonly cover_image_url: string | null;
  readonly last_read_at: string;
}

export interface MangadexReadingHistoryCreate {
  readonly mangadex_manga_id: string;
  readonly mangadex_chapter_id: string;
  readonly manga_title: string;
  readonly chapter_number: string;
  readonly cover_image_url?: string | null;
}

export interface MangadexReadingHistoryListResponse {
  readonly items: MangadexReadingHistory[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly pages: number;
}
