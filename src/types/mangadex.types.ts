// MangaDex API Types

export interface MangaDexResponse<T> {
  readonly result: "ok" | "error";
  readonly response: "collection" | "entity";
  readonly data: T;
  readonly limit?: number;
  readonly offset?: number;
  readonly total?: number;
}

export interface MangaDexManga {
  readonly id: string;
  readonly type: "manga";
  readonly attributes: MangaDexMangaAttributes;
  readonly relationships: MangaDexRelationship[];
}

export interface MangaDexMangaAttributes {
  readonly title: Record<string, string>;
  readonly altTitles: Record<string, string>[];
  readonly description: Record<string, string>;
  readonly isLocked: boolean;
  readonly links: Record<string, string> | null;
  readonly originalLanguage: string;
  readonly lastVolume: string | null;
  readonly lastChapter: string | null;
  readonly publicationDemographic:
    | "shounen"
    | "shoujo"
    | "josei"
    | "seinen"
    | null;
  readonly status: "ongoing" | "completed" | "hiatus" | "cancelled";
  readonly year: number | null;
  readonly contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  readonly tags: MangaDexTag[];
  readonly state: string;
  readonly chapterNumbersResetOnNewVolume: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
  readonly availableTranslatedLanguages: string[];
  readonly latestUploadedChapter: string | null;
}

export interface MangaDexTag {
  readonly id: string;
  readonly type: "tag";
  readonly attributes: {
    readonly name: Record<string, string>;
    readonly description: Record<string, string>;
    readonly group: string;
    readonly version: number;
  };
}

export interface MangaDexRelationship {
  readonly id: string;
  readonly type:
    | "author"
    | "artist"
    | "cover_art"
    | "manga"
    | "scanlation_group"
    | "user";
  readonly attributes?: MangaDexCoverArtAttributes | MangaDexAuthorAttributes;
}

export interface MangaDexCoverArtAttributes {
  readonly fileName: string;
  readonly description: string;
  readonly volume: string | null;
  readonly locale: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
}

export interface MangaDexAuthorAttributes {
  readonly name: string;
  readonly imageUrl: string | null;
  readonly biography: Record<string, string>;
  readonly twitter: string | null;
  readonly pixiv: string | null;
  readonly melonBook: string | null;
  readonly fanBox: string | null;
  readonly booth: string | null;
  readonly namicomi: string | null;
  readonly nicoVideo: string | null;
  readonly skeb: string | null;
  readonly fantia: string | null;
  readonly tumblr: string | null;
  readonly youtube: string | null;
  readonly weibo: string | null;
  readonly naver: string | null;
  readonly website: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
}

export interface MangaDexListParams {
  readonly limit?: number;
  readonly offset?: number;
  readonly title?: string;
  readonly authorOrArtist?: string;
  readonly authors?: string[];
  readonly artists?: string[];
  readonly year?: number;
  readonly includedTags?: string[];
  readonly excludedTags?: string[];
  readonly status?: ("ongoing" | "completed" | "hiatus" | "cancelled")[];
  readonly originalLanguage?: string[];
  readonly excludedOriginalLanguage?: string[];
  readonly availableTranslatedLanguage?: string[];
  readonly publicationDemographic?: (
    | "shounen"
    | "shoujo"
    | "josei"
    | "seinen"
  )[];
  readonly contentRating?: (
    | "safe"
    | "suggestive"
    | "erotica"
    | "pornographic"
  )[];
  readonly order?: Record<string, "asc" | "desc">;
  readonly includes?: ("author" | "artist" | "cover_art")[];
}

// Transformed manga for use in components (matching internal Manga type structure)
export interface MangaDexTransformedManga {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string | undefined;
  readonly cover_image_url: string | undefined;
  readonly status: "ongoing" | "completed" | "hiatus" | "cancelled";
  readonly content_rating: "safe" | "suggestive" | "erotica" | "pornographic";
  readonly author: string | undefined;
  readonly artist: string | undefined;
  readonly year: number | null;
  readonly tags: { id: string; name: string }[];
  readonly original_language: string;
  readonly mangadex_id: string;
  readonly available_languages: string[];
}

// Paginated response for browse page
export interface MangaDexPaginatedResponse {
  readonly items: MangaDexTransformedManga[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
  readonly pages: number;
  readonly page: number;
}

// MangaDex Chapter types
export interface MangaDexChapter {
  readonly id: string;
  readonly type: "chapter";
  readonly attributes: {
    readonly volume: string | null;
    readonly chapter: string | null;
    readonly title: string | null;
    readonly translatedLanguage: string;
    readonly externalUrl: string | null;
    readonly publishAt: string;
    readonly readableAt: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly pages: number;
    readonly version: number;
  };
  readonly relationships: MangaDexRelationship[];
}

export interface MangaDexTransformedChapter {
  readonly id: string;
  readonly chapter_number: string;
  readonly title: string | null;
  readonly language: string;
  readonly pages_count: number;
  readonly published_at: string;
  readonly scanlation_group: string | null;
  readonly external_url: string | null;
}

export interface MangaDexChapterPages {
  readonly baseUrl: string;
  readonly chapter: {
    readonly hash: string;
    readonly data: string[];
    readonly dataSaver: string[];
  };
}

// Browse filter params (simplified for UI)
export interface MangaDexBrowseParams {
  readonly page?: number;
  readonly limit?: number;
  readonly title?: string;
  readonly status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  readonly contentRating?: "safe" | "suggestive" | "erotica" | "pornographic";
  readonly demographic?: "shounen" | "shoujo" | "josei" | "seinen";
  readonly sortBy?:
    | "latestUploadedChapter"
    | "followedCount"
    | "relevance"
    | "rating"
    | "createdAt"
    | "title"
    | "year";
  readonly orderDesc?: boolean;
  readonly includedTags?: string[];
  readonly originalLanguage?: string;
  readonly availableTranslatedLanguage?: string;
  readonly authorOrArtist?: string;
}
