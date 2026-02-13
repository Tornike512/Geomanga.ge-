import type { Chapter } from "./chapter.types";
import type { Genre } from "./genre.types";
import type { Tag } from "./tag.types";
import type { UserRole } from "./user.types";

export interface MangaUploader {
  readonly id: number;
  readonly username: string;
  readonly avatar_url: string | null;
  readonly role: UserRole;
}

export enum MangaStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  HIATUS = "hiatus",
  CANCELLED = "cancelled",
}

export enum TranslationStatus {
  TRANSLATING = "translating",
  COMPLETED = "completed",
}

export enum ContentType {
  MANGA = "manga",
  MANHUA = "manhua",
  MANHWA = "manhwa",
  COMICS = "comics",
  OEL_MANGA = "oel_manga",
}

export enum AgeRating {
  FOR_EVERYONE = "for_everyone",
  SIXTEEN_PLUS = "16+",
  EIGHTEEN_PLUS = "18+",
}

export interface Manga {
  readonly id: number;
  readonly title: string;
  readonly slug: string;
  readonly description: string | undefined;
  readonly cover_image_url: string | undefined;
  readonly language: string;
  readonly status: MangaStatus;
  readonly translation_status: TranslationStatus;
  readonly content_type: ContentType;
  readonly age_rating: AgeRating;
  readonly author: string | undefined;
  readonly artist: string | undefined;
  readonly rating: number;
  readonly total_views: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly genres?: Genre[];
  readonly tags?: Tag[];
}

export interface ReadingProgress {
  readonly chapter_id: number;
  readonly chapter_number: number;
  readonly chapter_title: string | null;
  readonly last_page_read: number;
  readonly completed: boolean;
  readonly last_read_at: string;
}

export interface MangaDetail extends Manga {
  readonly genres: Genre[];
  readonly tags: Tag[];
  readonly chapter_count: number;
  readonly latest_chapter: Chapter | undefined;
  readonly uploader?: MangaUploader;
  readonly reading_progress?: ReadingProgress | null;
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
  readonly translation_status?: TranslationStatus;
  readonly content_type?: ContentType;
  readonly age_rating?: AgeRating;
  readonly author?: string;
  readonly artist?: string;
  readonly genre_ids?: number[];
  readonly tag_ids?: number[];
}

export interface MangaUpdate {
  readonly title?: string;
  readonly description?: string;
  readonly cover_image_url?: string;
  readonly status?: MangaStatus;
  readonly translation_status?: TranslationStatus;
  readonly content_type?: ContentType;
  readonly age_rating?: AgeRating;
  readonly author?: string;
  readonly artist?: string;
  readonly genre_ids?: number[];
  readonly tag_ids?: number[];
}

export interface MangaListParams {
  readonly page?: number;
  readonly limit?: number;
  readonly language?: "georgian" | "english";
  readonly status?: MangaStatus;
  readonly translation_status?: TranslationStatus;
  readonly content_type?: ContentType;
  readonly age_rating?: AgeRating;
  readonly genre?: number;
  readonly genres?: number[];
  readonly tags?: number[];
  readonly author?: string;
  readonly sort_by?: "created_at" | "updated_at" | "rating" | "views" | "title";
  readonly order_desc?: boolean;
  [key: string]: string | number | number[] | boolean | undefined;
}

export interface MangaSearchParams {
  readonly q: string;
  readonly language?: "georgian" | "english";
  readonly page?: number;
  readonly limit?: number;
}
