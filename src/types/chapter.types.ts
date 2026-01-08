import type { Manga } from "./manga.types";
import type { Page } from "./page.types";

export interface Chapter {
  readonly id: number;
  readonly manga_id: number;
  readonly chapter_number: number;
  readonly title: string | undefined;
  readonly volume: number | undefined;
  readonly release_date: string;
  readonly views: number;
}

export interface ChapterDetail extends Chapter {
  readonly page_count: number;
}

export interface ChapterWithPages extends Chapter {
  readonly pages: Page[];
  readonly manga?: Pick<Manga, "slug" | "title">;
  readonly next_chapter_id?: number;
  readonly previous_chapter_id?: number;
}

export interface ChapterCreate {
  readonly chapter_number: number;
  readonly title?: string;
  readonly volume?: number;
}

export interface ChapterUpdate {
  readonly chapter_number?: number;
  readonly title?: string;
  readonly volume?: number;
}

export interface ChapterListResponse {
  readonly items: Chapter[];
  readonly total: number;
}
