import type { Chapter } from "./chapter.types";
import type { Genre } from "./genre.types";

export enum MangaStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  HIATUS = "hiatus",
  CANCELLED = "cancelled",
}

export interface Manga {
  readonly id: number;
  readonly title: string;
  readonly slug: string;
  readonly description: string | undefined;
  readonly cover_image_url: string | undefined;
  readonly status: MangaStatus;
  readonly author: string | undefined;
  readonly artist: string | undefined;
  readonly rating: number;
  readonly total_views: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface MangaDetail extends Manga {
  readonly genres: Genre[];
  readonly chapter_count: number;
  readonly latest_chapter: Chapter | undefined;
}

export interface MangaListResponse {
  readonly items: Manga[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly pages: number;
}

export interface MangaCreate {
  readonly title: string;
  readonly description?: string;
  readonly cover_image_url?: string;
  readonly status?: MangaStatus;
  readonly author?: string;
  readonly artist?: string;
  readonly genre_ids?: number[];
}

export interface MangaUpdate {
  readonly title?: string;
  readonly description?: string;
  readonly cover_image_url?: string;
  readonly status?: MangaStatus;
  readonly author?: string;
  readonly artist?: string;
  readonly genre_ids?: number[];
}

export interface MangaListParams {
  readonly page?: number;
  readonly limit?: number;
  readonly status?: MangaStatus;
  readonly genre?: number;
  readonly sort_by?: "created_at" | "updated_at" | "rating" | "views" | "title";
  readonly order_desc?: boolean;
}
